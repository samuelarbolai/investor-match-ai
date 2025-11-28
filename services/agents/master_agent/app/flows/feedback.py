import json
import os
from datetime import datetime, timezone
from typing import Dict, Any, Optional

import httpx
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage

from app.clients import kapso, supabase
from app.models.chat import ConversationContext
from app.models.payloads import KapsoEvent

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)


def _timestamp_diff_seconds(user_record: Dict[str, Any], event: KapsoEvent) -> float:
    if not user_record or not user_record.get("updated_at"):
        return float("inf")
    last = datetime.fromisoformat(str(user_record["updated_at"]).replace("Z", "+00:00"))
    latest = event.messages[-1].created_at if event.messages else None
    if not latest:
        return 0
    latest_ts = datetime.fromisoformat(latest.replace("Z", "+00:00"))
    return (latest_ts - last).total_seconds()


async def _load_user(event: KapsoEvent) -> Dict[str, Any]:
    res = (
        supabase.SUPABASE.table("whatsapp_users")
        .select("*")
        .eq("user_phone_number", event.phone_number)
        .single()
        .execute()
    )
    return res.data if res and res.data else {}


async def _fetch_conversation(event: KapsoEvent) -> str:
    convo = await kapso.fetch_conversation(event.conversation_id)
    return json.dumps(convo)


async def _summarize_feedback(event: KapsoEvent, conversation: str) -> Dict[str, Any]:
    latest = event.messages[-1].body if event.messages else ""
    prompt = f"""
    Summarize this WhatsApp feedback. Latest message: {latest}
    Conversation context: {conversation}
    Identify approval/rejection and key notes.
    Output JSON with fields approval (approve|reject|neutral) and notes.
    """
    response = await llm.apredict_messages(
        [SystemMessage(content="Feedback summarizer"), HumanMessage(content=prompt)]
    )
    try:
        return json.loads(response.content)
    except json.JSONDecodeError:
        return {"approval": "neutral", "notes": response.content.strip()}


def _persist_feedback(event: KapsoEvent, summary: Dict[str, Any]) -> None:
    supabase.SUPABASE.table("campaign_feedback").insert(
        {
            "user_id": event.contact_id,
            "kapso_conversation_id": event.conversation_id,
            "kapso_message_id": event.messages[-1].id if event.messages else "",
            "raw_message": event.messages[-1].body if event.messages else "",
            "parsed_sentiment": summary.get("approval"),
            "parsed_content": summary,
        }
    ).execute()


def _latest_pending_proposal(user_id: Optional[str]) -> Optional[str]:
    if not user_id:
        return None
    response = (
        supabase.SUPABASE.table("campaign_proposals")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "pending")
        .order("sent_at", desc=True)
        .limit(1)
        .execute()
    )
    data = getattr(response, "data", None)
    if isinstance(data, list) and data:
        return data[0].get("id")
    return None


def _mark_proposal_responded(event: KapsoEvent, summary: Dict[str, Any]) -> None:
    proposal_id = (event.metadata or {}).get("campaign_proposal_id")
    if not proposal_id:
        proposal_id = _latest_pending_proposal(event.contact_id)
    if not proposal_id:
        return
    supabase.SUPABASE.table("campaign_proposals").update(
        {
            "status": "responded",
            "feedback_summary": summary.get("notes"),
        }
    ).eq("id", proposal_id).execute()


async def _notify_backend(event: KapsoEvent, summary: Dict[str, Any]) -> None:
    base_url = os.environ.get("IM_API_BASE_URL")
    api_key = os.environ.get("IM_API_KEY", "")
    if not base_url or not event.contact_id:
        return
    payload = {"contactId": event.contact_id, "feedback": summary}
    async with httpx.AsyncClient(timeout=10.0) as client:
        await client.post(
            f"{base_url}/v1/feedback",
            headers={"x-api-key": api_key},
            json=payload,
        )


async def _send_ack(event: KapsoEvent, summary: Dict[str, Any]) -> Dict[str, Any]:
    metadata = event.metadata or {}
    phone_number_id = metadata.get("phone_number_id")
    if not phone_number_id or not event.phone_number:
        return {"reply": None}
    notes = summary.get("notes", "Thanks for the update!")
    body = f"Thanks! Logged your feedback: {notes}"
    await kapso.send_text(
        phone_number_id=phone_number_id,
        to=event.phone_number,
        body=body,
    )
    return {"reply": body}


async def run_feedback_flow(event: KapsoEvent, context: ConversationContext) -> Dict[str, Any]:
    user_record = await _load_user(event)
    conversation = ""
    if _timestamp_diff_seconds(user_record, event) > 86400:
        conversation = await _fetch_conversation(event)
    summary = await _summarize_feedback(event, conversation)
    _persist_feedback(event, summary)
    _mark_proposal_responded(event, summary)
    await _notify_backend(event, summary)
    result = await _send_ack(event, summary)
    result.update({"feedback_summary": summary})
    return result

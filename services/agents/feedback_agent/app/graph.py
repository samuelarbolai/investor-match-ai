import json
import os
from datetime import datetime, timezone
import httpx
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from app.models.payloads import KapsoEvent
from postgrest.exceptions import APIError
from app.clients import kapso, supabase

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)


async def load_user(event: KapsoEvent):
    try:
        res = (
            supabase.SUPABASE.table("whatsapp_users")
            .select("*")
            .eq("user_phone_number", event.phone_number)
            .single()
            .execute()
        )
        return res.data if res and res.data else {}
    except APIError as exc:
        if getattr(exc, "code", "") == "PGRST116":
            return {}
        raise


def needs_context(user_record, event: KapsoEvent):
    if not user_record or not user_record.get("updated_at"):
        return True
    last = datetime.fromisoformat(str(user_record["updated_at"]).replace("Z", "+00:00"))
    latest_ts = datetime.fromisoformat(event.messages[-1].created_at.replace("Z", "+00:00"))
    return (latest_ts - last).total_seconds() > 86400


async def summarize_feedback(event: KapsoEvent, conversation: str):
    prompt = f"""
    Summarize this WhatsApp feedback. Latest message: {event.messages[-1].body}
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


async def persist_feedback(event: KapsoEvent, summary_json):
    supabase.SUPABASE.table("whatsapp_users").upsert(
        {
            "user_id": event.contact_id,
            "user_phone_number": event.phone_number,
        },
        on_conflict="user_id"
    ).execute()
    supabase.SUPABASE.table("campaign_feedback").insert(
        {
            "user_id": event.contact_id,
            "kapso_conversation_id": event.conversation_id,
            "kapso_message_id": event.messages[-1].id,
            "raw_message": event.messages[-1].body,
            "parsed_content": summary_json,
        }
    ).execute()


async def notify_api(event: KapsoEvent, summary_json):
    base_url = os.environ.get("IM_API_BASE_URL", "")
    if not base_url:
        return
    async with httpx.AsyncClient(timeout=10.0) as client:
        await client.post(
            f"{base_url}/v1/feedback",
            headers={"x-api-key": os.environ.get("IM_API_KEY", "")},
            json={"contactId": event.contact_id, "feedback": summary_json},
        )


async def send_ack(event: KapsoEvent, summary_json):
    summary = summary_json.get("notes", "Thanks for the update!")
    await kapso.send_text(
        phone_number_id=event.metadata["phone_number_id"],
        to=event.phone_number,
        body=f"Thanks! Logged your feedback: {summary}",
    )


async def run_flow(event: KapsoEvent):
    workflow = StateGraph(dict)

    async def start(_state):
        user_record = await load_user(event)
        convo = ""
        if needs_context(user_record, event):
            convo_data = await kapso.fetch_conversation(event.conversation_id)
            convo = json.dumps(convo_data)
        summary = await summarize_feedback(event, convo)
        await persist_feedback(event, summary)
        await notify_api(event, summary)
        await send_ack(event, summary)
        return {"status": "processed", "summary": summary}

    workflow.add_node("start", start)
    workflow.set_entry_point("start")
    workflow.add_edge("start", END)
    compiled = workflow.compile()
    result = await compiled.ainvoke({})
    return result

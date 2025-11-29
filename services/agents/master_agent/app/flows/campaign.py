from typing import Dict, Any, Optional
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage

from app.clients import kapso, supabase
from app.models.chat import ConversationContext
from app.models.payloads import KapsoEvent

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)


def _ensure_user(event: KapsoEvent) -> None:
    if not event.contact_id or not event.phone_number:
        return
    payload = {
        "user_id": event.contact_id,
        "user_phone_number": event.phone_number,
    }
    supabase.SUPABASE.table("whatsapp_users").upsert(payload, on_conflict="user_id").execute()


def _build_prompt(event: KapsoEvent) -> str:
    prospects = event.metadata.get("prospects", []) if event.metadata else []
    bullet_list = "\n".join(
        [f"- {p.get('full_name')} ({p.get('headline', '')})" for p in prospects]
    )
    return (
        f"You are Investor Match campaign assistant. Owner {event.owner_id} has {len(prospects)} fresh prospects.\n"
        f"Summaries:\n{bullet_list}\n"
        "Craft a concise WhatsApp proposal asking for approval."
    )


def _store_proposal(event: KapsoEvent, proposal_text: str) -> Optional[str]:
    response = (
        supabase.SUPABASE.table("campaign_proposals")
        .insert(
            {
                "user_id": event.contact_id,
                "proposal_payload": {
                    "prospects": event.metadata.get("prospects", []) if event.metadata else [],
                    "phone_number": event.phone_number,
                },
                "feedback_summary": proposal_text,
                "status": "pending",
            }
        )
        .execute()
    )
    data = getattr(response, "data", None)
    if isinstance(data, list) and data:
        return data[0].get("id")
    return None


async def _send_proposal(event: KapsoEvent, proposal_text: str) -> Dict[str, Any]:
    metadata = event.metadata or {}
    phone_number_id = metadata.get("phone_number_id")
    if not phone_number_id or not event.phone_number:
        raise ValueError("phone_number_id and phone_number are required for campaign proposals")
    await kapso.send_text(
        phone_number_id=phone_number_id,
        to=event.phone_number,
        body=proposal_text,
    )
    return {"reply": proposal_text, "proposal_sent": True}


async def _build_proposal_text(event: KapsoEvent) -> str:
    prompt = _build_prompt(event)
    response = await llm.apredict_messages(
        [SystemMessage(content="Campaign proposal assistant"), HumanMessage(content=prompt)]
    )
    return response.content


async def run_campaign_flow(event: KapsoEvent, context: ConversationContext) -> Dict[str, Any]:
    _ensure_user(event)
    proposal_text = await _build_proposal_text(event)
    proposal_id = _store_proposal(event, proposal_text)
    if proposal_id:
        event.metadata = event.metadata or {}
        event.metadata["campaign_proposal_id"] = proposal_id
    result = await _send_proposal(event, proposal_text)
    return result

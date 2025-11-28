import json
from typing import Dict, Any
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage

from app.clients import supabase
from app.models.chat import ConversationContext
from app.llm.prompts import (
    build_intake_context,
    build_completion_context,
    build_summary_context,
    get_intake_prompt,
    get_completion_prompt,
    get_summary_prompt,
)
from app.models.payloads import KapsoEvent

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)


def _resolve_user_id(event: KapsoEvent) -> str:
    if event.contact_id:
        return event.contact_id
    if event.phone_number:
        return event.phone_number
    return event.conversation_id


def _build_transcript(context: ConversationContext) -> str:
    lines: list[str] = []
    for message in context.recent_messages:
        if not message.content:
            continue
        if message.role == "user":
            label = "User"
        elif message.role == "assistant":
            label = "Agent"
        else:
            label = message.role.title()
        lines.append(f"{label}: {message.content.strip()}")
    return "\n".join(lines).strip()


async def generate_reply(stored_summary: str, transcript: str) -> str:
    context = build_intake_context(stored_summary, transcript)
    response = await llm.apredict_messages(
        [SystemMessage(content=get_intake_prompt()), HumanMessage(content=context)]
    )
    return response.content


async def evaluate_completion(stored_summary: str, transcript: str, reply: str) -> bool:
    context = build_completion_context(stored_summary, transcript, reply)
    completion = await llm.apredict_messages(
        [SystemMessage(content=get_completion_prompt()), HumanMessage(content=context)]
    )
    try:
        data = json.loads(completion.content)
        return bool(data.get("complete"))
    except json.JSONDecodeError:
        return "true" in completion.content.lower()


async def build_summary(stored_summary: str, transcript: str, reply: str) -> str:
    context = build_summary_context(stored_summary, transcript, reply)
    summary = await llm.apredict_messages(
        [SystemMessage(content=get_summary_prompt()), HumanMessage(content=context)]
    )
    return summary.content.strip()


def _persist_metadata(event: KapsoEvent, summary: str) -> None:
    user_id = _resolve_user_id(event)
    payload = {
        "user_id": user_id,
        "user_phone_number": event.phone_number,
        "last_conversation_id": event.conversation_id,
        "conversation_summary": summary,
    }
    supabase.SUPABASE.table("whatsapp_users").upsert(payload, on_conflict="user_id").execute()


async def run_onboarding_flow(event: KapsoEvent, context: ConversationContext) -> Dict[str, Any]:
    stored_summary = context.summary or ""
    transcript = _build_transcript(context)
    reply = await generate_reply(stored_summary, transcript)
    conversation_complete = await evaluate_completion(stored_summary, transcript, reply)
    updated_summary = stored_summary
    if conversation_complete:
        updated_summary = await build_summary(stored_summary, transcript, reply)
    _persist_metadata(event, updated_summary)
    return {
        "reply": reply,
        "conversation_complete": conversation_complete,
        "summary": updated_summary,
    }

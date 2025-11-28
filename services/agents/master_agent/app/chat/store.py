from __future__ import annotations

import datetime as dt
from typing import Any, Dict, Iterable, List, Optional

from app.clients import supabase
from app.models.chat import ConversationContext, MessageContext
from app.models.payloads import KapsoEvent, KapsoMessage

MAX_CONTEXT_MESSAGES = 40  # 20 turns


def _utcnow() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def _get_agent(slug: str) -> Dict[str, Any]:
    response = (
        supabase.SUPABASE.table("agents")
        .select("*")
        .eq("slug", slug)
        .single()
        .execute()
    )
    if not response.data:
        raise RuntimeError(f"Agent '{slug}' is not configured in Supabase.")
    return response.data


def _find_conversation(agent_id: str, external_id: Optional[str], phone_number: Optional[str]) -> Optional[Dict[str, Any]]:
    query = supabase.SUPABASE.table("conversations").select("*").eq("agent_id", agent_id)
    if external_id:
        resp = query.eq("external_conversation_id", external_id).limit(1).single().execute()
        if resp.data:
            return resp.data
    if phone_number:
        resp = (
            supabase.SUPABASE.table("conversations")
            .select("*")
            .eq("agent_id", agent_id)
            .eq("phone_number", phone_number)
            .limit(1)
            .single()
            .execute()
        )
        if resp.data:
            return resp.data
    return None


def _create_conversation(agent: Dict[str, Any], event: KapsoEvent) -> Dict[str, Any]:
    payload = {
        "agent_id": agent["id"],
        "external_conversation_id": event.conversation_id,
        "owner_id": event.owner_id,
        "contact_id": event.contact_id,
        "phone_number": event.phone_number,
        "title": (event.metadata or {}).get("topic") if event.metadata else None,
        "prompt_version": agent.get("default_prompt_version"),
        "created_at": _utcnow(),
        "updated_at": _utcnow(),
    }
    response = supabase.SUPABASE.table("conversations").insert(payload).select("*").single().execute()
    if not response.data:
        raise RuntimeError("Failed to create conversation row")
    return response.data


def ensure_conversation(agent_slug: str, event: KapsoEvent) -> Dict[str, Any]:
    agent = _get_agent(agent_slug)
    conversation = _find_conversation(agent["id"], event.conversation_id, event.phone_number)
    if conversation:
        conversation["agent_slug"] = agent_slug
        return conversation
    conversation = _create_conversation(agent, event)
    conversation["agent_slug"] = agent_slug
    return conversation


def _next_sequence(conversation_id: str) -> int:
    response = (
        supabase.SUPABASE.table("messages")
        .select("sequence")
        .eq("conversation_id", conversation_id)
        .order("sequence", desc=True)
        .limit(1)
        .execute()
    )
    data = response.data or []
    current = data[0]["sequence"] if data else 0
    return int(current) + 1


def _message_role(msg: KapsoMessage) -> str:
    if (msg.type or "").lower() == "system":
        return "system"
    direction = (msg.direction or "").lower()
    return "assistant" if direction == "outbound" else "user"


def record_event_messages(conversation_id: str, messages: Iterable[KapsoMessage]) -> None:
    new_messages = []
    seq = _next_sequence(conversation_id)
    for msg in messages:
        if not msg.body:
            continue
        metadata = {
            "kapso_message_id": msg.id,
            "direction": msg.direction,
            "type": msg.type,
            "created_at": msg.created_at,
        }
        new_messages.append(
            {
                "conversation_id": conversation_id,
                "sequence": seq,
                "role": _message_role(msg),
                "content": msg.body.strip(),
                "metadata": metadata,
                "created_at": msg.created_at or _utcnow(),
            }
        )
        seq += 1
    if not new_messages:
        return
    supabase.SUPABASE.table("messages").insert(new_messages).execute()
    supabase.SUPABASE.table("conversations").update(
        {"last_message_at": _utcnow(), "updated_at": _utcnow()}
    ).eq("id", conversation_id).execute()


def append_assistant_message(conversation_id: str, content: str, *, metadata: Optional[Dict[str, Any]] = None, token_usage: Optional[Dict[str, Any]] = None, latency_ms: Optional[int] = None) -> None:
    seq = _next_sequence(conversation_id)
    supabase.SUPABASE.table("messages").insert(
        {
            "conversation_id": conversation_id,
            "sequence": seq,
            "role": "assistant",
            "content": content,
            "metadata": metadata,
            "token_usage": token_usage,
            "latency_ms": latency_ms,
            "created_at": _utcnow(),
        }
    ).execute()
    supabase.SUPABASE.table("conversations").update(
        {"last_message_at": _utcnow(), "updated_at": _utcnow()}
    ).eq("id", conversation_id).execute()


def fetch_recent_messages(conversation_id: str, limit: int = MAX_CONTEXT_MESSAGES) -> List[MessageContext]:
    response = (
        supabase.SUPABASE.table("messages")
        .select("role, content, metadata")
        .eq("conversation_id", conversation_id)
        .order("sequence", desc=True)
        .limit(limit)
        .execute()
    )
    data = response.data or []
    ordered = list(reversed(data))
    return [
        MessageContext(role=row["role"], content=row["content"], metadata=row.get("metadata"))
        for row in ordered
    ]


def build_conversation_context(conversation: Dict[str, Any]) -> ConversationContext:
    recent = fetch_recent_messages(conversation["id"])
    summary = conversation.get("summary") or ""
    return ConversationContext(
        id=conversation["id"],
        agent_slug=conversation.get("agent_slug") or "",
        summary=summary,
        prompt_version=conversation.get("prompt_version"),
        recent_messages=recent,
    )


def update_conversation_summary(conversation_id: str, summary: str) -> None:
    supabase.SUPABASE.table("conversations").update(
        {"summary": summary, "updated_at": _utcnow()}
    ).eq("id", conversation_id).execute()


def log_ai_event(conversation_id: str, *, event_type: str, model: Optional[str] = None, status: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None) -> None:
    supabase.SUPABASE.table("ai_events").insert(
        {
            "conversation_id": conversation_id,
            "event_type": event_type,
            "model": model,
            "status": status,
            "metadata": metadata,
            "created_at": _utcnow(),
        }
    ).execute()

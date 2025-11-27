from typing import Dict, Any
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from app.models.payloads import KapsoEvent
from postgrest.exceptions import APIError
from app.clients import supabase

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)


def _resolve_user_id(event: KapsoEvent) -> str:
    if event.contact_id:
        return event.contact_id
    if event.phone_number:
        return event.phone_number
    return event.conversation_id


async def load_user(event: KapsoEvent) -> Dict[str, Any]:
    if not event.phone_number:
        return {"user_record": None}
    query = (
        supabase.SUPABASE.table("whatsapp_users")
        .select("*")
        .eq("user_phone_number", event.phone_number)
        .single()
    )
    try:
        result = query.execute()
        return {"user_record": result.data if result.data else None}
    except APIError as exc:
        if getattr(exc, "code", "") == "PGRST116":
            return {"user_record": None}
        raise


async def summarize(event: KapsoEvent, state: Dict[str, Any]) -> Dict[str, Any]:
    latest = event.messages[-1].body if event.messages else ""
    summary_prompt = f"Summarize onboarding conversation so far. Latest message: {latest}"
    summary = await llm.apredict_messages(
        [SystemMessage(content="Summarize conversations"), HumanMessage(content=summary_prompt)]
    )
    return {"conversation_summary": summary.content}


async def generate_reply(event: KapsoEvent, state: Dict[str, Any]) -> Dict[str, Any]:
    latest = event.messages[-1].body if event.messages else ""
    phone = event.phone_number or "unknown"
    prompt = f"""
    You are the onboarding assistant. User phone: {phone}.
    Latest message: {latest}
    Conversation summary so far: {state.get('conversation_summary', '')}
    Ask for missing data (company, role) if not captured yet.
    """
    reply = await llm.apredict_messages(
        [SystemMessage(content="Onboarding assistant"), HumanMessage(content=prompt)]
    )
    return {"reply": reply.content}


async def persist(event: KapsoEvent, state: Dict[str, Any]) -> Dict[str, Any]:
    user_id = _resolve_user_id(event)
    payload = {
        "user_id": user_id,
        "user_phone_number": event.phone_number,
        "last_conversation_id": event.conversation_id,
        "conversation_summary": state["conversation_summary"],
    }
    supabase.SUPABASE.table("whatsapp_users").upsert(payload, on_conflict="user_id").execute()
    return {}


async def run_flow(event: KapsoEvent) -> Dict[str, Any]:
    workflow = StateGraph(dict)

    async def load_user_node(state):
        new_state = dict(state)
        new_state.update(await load_user(event))
        return new_state

    async def summarize_node(state):
        new_state = dict(state)
        new_state.update(await summarize(event, state))
        return new_state

    async def reply_node(state):
        new_state = dict(state)
        new_state.update(await generate_reply(event, state))
        return new_state

    async def persist_node(state):
        new_state = dict(state)
        await persist(event, state)
        return new_state

    workflow.add_node("load_user", load_user_node)
    workflow.add_node("summarize", summarize_node)
    workflow.add_node("reply", reply_node)
    workflow.add_node("persist", persist_node)

    workflow.set_entry_point("load_user")
    workflow.add_edge("load_user", "summarize")
    workflow.add_edge("summarize", "reply")
    workflow.add_edge("reply", "persist")
    workflow.add_edge("persist", END)

    compiled = workflow.compile()
    result = await compiled.ainvoke({})
    return {"reply": result["reply"]}

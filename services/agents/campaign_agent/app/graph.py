from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from app.models.payloads import KapsoEvent
from app.clients import kapso, supabase

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)


async def build_proposal(event: KapsoEvent, _state):
    prospects = event.metadata.get("prospects", []) if event.metadata else []
    bullet_list = "\n".join([f"- {p['full_name']} ({p.get('headline', '')})" for p in prospects])
    prompt = f"""You are Investor Match campaign assistant. Owner {event.owner_id} has {len(prospects)} fresh prospects.
Summaries:
{bullet_list}
Craft a concise WhatsApp proposal asking for approval."""
    response = await llm.apredict_messages(
        [SystemMessage(content="Campaign proposal assistant"), HumanMessage(content=prompt)]
    )
    return {"proposal_text": response.content}


async def ensure_user(event: KapsoEvent):
    supabase.SUPABASE.table("whatsapp_users").upsert(
        {
            "user_id": event.contact_id,
            "user_phone_number": event.phone_number,
        },
        on_conflict="user_id"
    ).execute()


async def store_proposal(event: KapsoEvent, state):
    await ensure_user(event)
    supabase.SUPABASE.table("campaign_proposals").insert(
        {
            "user_id": event.contact_id,
            "proposal_payload": event.metadata.get("prospects", []) if event.metadata else [],
        }
    ).execute()
    return {}


async def send(event: KapsoEvent, state):
    await kapso.send_text(
        phone_number_id=event.metadata["phone_number_id"],
        to=event.phone_number,
        body=state["proposal_text"],
    )
    return {"status": "sent"}


async def run_flow(event: KapsoEvent):
    workflow = StateGraph(dict)

    async def build_node(state):
        new_state = dict(state)
        new_state.update(await build_proposal(event, state))
        return new_state

    async def store_node(state):
        await store_proposal(event, state)
        return dict(state)

    async def send_node(state):
        new_state = dict(state)
        new_state.update(await send(event, state))
        return new_state

    workflow.add_node("build", build_node)
    workflow.add_node("store", store_node)
    workflow.add_node("send", send_node)
    workflow.set_entry_point("build")
    workflow.add_edge("build", "store")
    workflow.add_edge("store", "send")
    workflow.add_edge("send", END)
    compiled = workflow.compile()
    result = await compiled.ainvoke({})
    return result

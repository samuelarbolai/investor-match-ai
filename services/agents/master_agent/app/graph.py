from typing import Any, Dict

from app.chat import store
from app.flows import get_flow_runner
from app.models.chat import ConversationContext
from app.models.payloads import KapsoEvent


def _extract_flow(event: KapsoEvent) -> str:
    return (event.metadata or {}).get("flow") if event.metadata else None


async def run_flow(event: KapsoEvent) -> Dict[str, Any]:
    flow = _extract_flow(event) or "onboarding"
    conversation = store.ensure_conversation(flow, event)
    if event.messages:
        store.record_event_messages(conversation["id"], event.messages)
    context: ConversationContext = store.build_conversation_context(conversation)
    runner = get_flow_runner(flow)
    result = await runner(event, context)

    reply = result.get("reply")
    if reply:
        store.append_assistant_message(
            conversation["id"],
            reply,
            metadata={"flow": flow},
        )

    summary = result.get("summary")
    if summary is not None:
        store.update_conversation_summary(conversation["id"], summary)

    return result

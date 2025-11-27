from app.models.payloads import KapsoEvent


async def run_flow(event: KapsoEvent):
    return {"status": "not-yet-implemented", "conversation_id": event.conversation_id}

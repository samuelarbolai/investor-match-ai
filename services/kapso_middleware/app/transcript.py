from .models import KapsoWebhook

def build_transcript(payload: KapsoWebhook) -> str:
    turns = []
    if payload.batch_payload:
        entries = payload.batch_payload.data
        for entry in entries:
            msg = entry.message
            sender = (
                "User"
                if msg.kapso and msg.kapso.get("direction") == "inbound"
                else "Assistant"
            )
            body = msg.text.body if msg.text else ""
            if body:
                turns.append(f"{sender}: {body}")

    if payload.conversation_event:
        convo = payload.conversation_event.conversation
        last_text = (convo.kapso or {}).get("last_message_text", "")
        if last_text:
            turns.append(f"User: {last_text}")

    return "\n".join(turns).strip()

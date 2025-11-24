from app.models import KapsoWebhook, KapsoEventEntry, KapsoMessage, KapsoConversation
from app.transcript import build_transcript

def test_build_transcript_basic():
    payload = KapsoWebhook(
        type="whatsapp.message.received",
        data=[
            KapsoEventEntry(
                message=KapsoMessage(
                    id="1",
                    from_="123",
                    text={"body": "Hi"},
                    type="text",
                    timestamp="0",
                    kapso={"direction": "inbound"},
                ),
                conversation=KapsoConversation(id="conv"),
                phone_number_id="pn",
                is_new_conversation=True,
            )
        ],
    )
    transcript = build_transcript(payload)
    assert transcript == "User: Hi"
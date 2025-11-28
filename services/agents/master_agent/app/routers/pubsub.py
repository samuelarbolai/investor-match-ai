import logging
from typing import List

from fastapi import APIRouter, HTTPException

from app.graph import run_flow
from app.models.payloads import KapsoEvent, KapsoMessage
from app.models.pubsub import PubSubEnvelope, StageEventPayload

logger = logging.getLogger(__name__)

router = APIRouter(tags=["pubsub"])


def _stage_event_to_kapso(event: StageEventPayload, message_id: str | None) -> KapsoEvent:
    metadata = event.to_metadata()
    # Ensure a default campaign flow so the graph routes correctly.
    metadata.setdefault("flow", "campaign_proposal")
    conversation_id = f"pubsub::{event.owner_id}::{event.new_stage}"
    synthetic_message = KapsoMessage(
        id=message_id or conversation_id,
        body=f"Stage changed to {event.new_stage} for {len(event.target_ids)} contacts",
        type="system",
        direction="outbound",
        created_at=event.changed_at,
    )
    return KapsoEvent(
        event_type=event.event,
        conversation_id=conversation_id,
        owner_id=event.owner_id,
        contact_id=event.owner_id,
        phone_number=event.phone_number,
        messages=[synthetic_message],
        metadata=metadata,
    )


async def _handle_stage_events(events: List[StageEventPayload], message_id: str | None):
    for stage_event in events:
        kapso_event = _stage_event_to_kapso(stage_event, message_id)
        await run_flow(kapso_event)


@router.post("/")
@router.post("/pubsub/stage-events")
async def handle_pubsub(envelope: PubSubEnvelope):
    try:
        payload_dict = envelope.message.decode_data()
    except Exception as exc:  # pragma: no cover - guard against malformed payloads
        logger.error("Failed to decode pubsub message: %s", exc)
        raise HTTPException(status_code=400, detail="Invalid Pub/Sub payload") from exc

    if isinstance(payload_dict, list):
        stage_events = [StageEventPayload.model_validate(obj) for obj in payload_dict]
    else:
        stage_events = [StageEventPayload.model_validate(payload_dict)]

    await _handle_stage_events(stage_events, envelope.message.effective_message_id)
    return {"status": "ok"}

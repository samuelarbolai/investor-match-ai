import logging
import traceback
from typing import Dict

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

from app.config import settings
from app.idempotency import mark_processed, was_processed
from app.models import KapsoWebhook
from app.parser_client import send_to_parser
from app.routers.shared import forward_to_agent, pick_agent_url
from app.transcript import build_transcript
from app.utils.signature import verify_signature

logger = logging.getLogger(__name__)
router = APIRouter(tags=["webhooks"])


IMPORTANT_HEADERS = {
    "x-webhook-event",
    "x-webhook-signature",
    "x-idempotency-key",
    "x-webhook-payload-version",
    "x-webhook-batch",
    "x-webhook-timestamp",
}


def _collect_headers(request: Request) -> Dict[str, str]:
    collected: Dict[str, str] = {}
    for name, value in request.headers.items():
        lname = name.lower()
        if lname.startswith("x-") or lname in IMPORTANT_HEADERS:
            collected[lname] = value
    return collected


@router.post("/webhooks/kapso")
async def kapso_webhook(request: Request):
    raw_body = await request.body()
    if not raw_body.strip():
        raise HTTPException(status_code=400, detail="Body empty")

    headers = _collect_headers(request)
    signature = headers.get("x-webhook-signature")
    timestamp = headers.get("x-webhook-timestamp")
    verify_signature(settings.kapso_webhook_secret, signature, raw_body, timestamp)

    raw_text = raw_body.decode("utf-8")
    try:
        payload = KapsoWebhook.parse_raw_payload(raw_text)
    except Exception as exc:
        logger.exception("Failed to parse Kapso payload")
        raise HTTPException(status_code=422, detail=f"Invalid payload: {exc}") from exc

    if settings.log_bodies:
        logger.info("Kapso headers=%s payload=%s", headers, payload.model_dump_json())

    normalized_event = payload.to_normalized(headers)
    preview = (
        normalized_event.messages[0].body
        if normalized_event.messages
        else None
    )
    logger.info(
        "[KapsoWebhook] event=%s conversation=%s phone=%s owner=%s contact=%s preview=%r",
        normalized_event.event_type,
        normalized_event.conversation_id,
        normalized_event.phone_number,
        normalized_event.owner_id,
        normalized_event.contact_id,
        preview,
    )
    idempotency_key = normalized_event.idempotency_key

    if await was_processed(idempotency_key):
        logger.info("Kapso idempotency hit: %s", idempotency_key)
        return JSONResponse({"status": "already-processed"})

    agent_url = pick_agent_url(normalized_event)

    parser_response = None
    if settings.forward_to_parser:
        transcript = build_transcript(payload)
        if not transcript:
            raise HTTPException(status_code=400, detail="Conversation transcript empty")
        try:
            parser_response = await send_to_parser(transcript)
        except Exception as exc:
            logger.error("Parser call failed: %s\n%s", exc, traceback.format_exc())
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    agent_result = await forward_to_agent(
        agent_url,
        normalized_event.model_dump(mode="json"),
        idempotency_key=idempotency_key,
    )

    await mark_processed(idempotency_key)

    return JSONResponse(
        {
            "status": "queued",
            "parser_response": parser_response,
            "agent_response": agent_result,
        }
    )

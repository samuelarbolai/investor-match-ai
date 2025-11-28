import json
import logging

from fastapi import APIRouter
from app.graph import run_flow
from app.models.payloads import KapsoEvent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/agents/whatsapp", tags=["whatsapp"])


@router.post("/inbound")
async def inbound(event: KapsoEvent):
    try:
        logger.info("[MasterAgent] inbound payload: %s", json.dumps(event.model_dump()))
    except Exception as exc:
        logger.warning("[MasterAgent] failed to log inbound payload: %s", exc)
    return await run_flow(event)


@router.post("/invoke")
async def invoke(event: KapsoEvent):
    return await run_flow(event)

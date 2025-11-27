import logging
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from app.config import settings
from app.kapso_client import (
    fetch_conversation as kapso_fetch_conversation,
)
from app.kapso_client import (
    send_text as kapso_send_text,
)

router = APIRouter(prefix="/internal", tags=["internal"])
logger = logging.getLogger(__name__)


class SendMessageRequest(BaseModel):
    phone_number_id: str
    to: str
    body: str


def require_internal_token(x_internal_token: Optional[str] = Header(default=None)):
    if not settings.internal_access_token:
        return
    if x_internal_token != settings.internal_access_token:
        raise HTTPException(status_code=401, detail="Invalid internal access token")


@router.post("/send-message")
async def send_message(
    req: SendMessageRequest,
    _authorized: None = Depends(require_internal_token),
):
    try:
        logger.info(
            "[KapsoOutbound] send-message phone_number_id=%s to=%s",
            req.phone_number_id,
            req.to,
        )
        return await kapso_send_text(req.phone_number_id, req.to, req.body)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)


@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    _authorized: None = Depends(require_internal_token),
):
    try:
        logger.info("[KapsoOutbound] get-conversation conversation_id=%s", conversation_id)
        return await kapso_fetch_conversation(conversation_id)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)

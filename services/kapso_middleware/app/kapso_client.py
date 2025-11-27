import logging
from urllib.parse import urljoin

import httpx

from .config import settings

logger = logging.getLogger(__name__)


async def send_text(phone_number_id: str, to: str, body: str) -> dict:
    base = str(settings.kapso_whatsapp_base_url).rstrip("/")
    endpoint = f"{base}/v21.0/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": body},
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            endpoint,
            headers={"X-API-Key": settings.kapso_api_key},
            json=payload,
        )
        resp.raise_for_status()
        logger.info(
            "[KapsoOutbound] message sent phone_number_id=%s to=%s status=%s",
            phone_number_id,
            to,
            resp.status_code,
        )
        return resp.json()


async def fetch_conversation(conversation_id: str) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(
            f"{settings.kapso_base_url}conversations/{conversation_id}",
            headers={"X-API-Key": settings.kapso_api_key},
        )
        resp.raise_for_status()
        logger.info(
            "[KapsoOutbound] conversation fetched conversation_id=%s status=%s",
            conversation_id,
            resp.status_code,
        )
        return resp.json()

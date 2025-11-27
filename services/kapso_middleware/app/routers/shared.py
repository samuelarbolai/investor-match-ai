import asyncio
import logging
from typing import Any, Dict, Optional

import httpx
from fastapi import HTTPException

from app.config import settings
from app.models import NormalizedKapsoEvent

logger = logging.getLogger(__name__)


def _flow_hint(event: NormalizedKapsoEvent) -> str:
    metadata = event.metadata or {}
    headers = event.headers or {}
    candidates = [
        metadata.get("flow"),
        metadata.get("kapso_flow"),
        metadata.get("campaign_flow"),
        metadata.get("kapso_type"),
        headers.get("x-webhook-event"),
        event.event_type,
    ]
    for candidate in candidates:
        if candidate:
            return str(candidate).lower()
    return ""


def pick_agent_url(event: NormalizedKapsoEvent) -> Optional[str]:
    event_type = _flow_hint(event)

    if "feedback" in event_type:
        return settings.agent_feedback_url
    if "setter" in event_type:
        return settings.agent_setter_url
    if "stage" in event_type or "campaign" in event_type:
        return settings.agent_campaign_url
    return settings.agent_onboarding_url


async def forward_to_agent(
    agent_url: Optional[str],
    payload: Dict[str, Any],
    retries: int = 3,
    idempotency_key: Optional[str] = None,
):
    if not agent_url:
        raise HTTPException(status_code=502, detail="No agent URL configured for payload")

    target_url = str(agent_url)
    delay = 1.0
    async with httpx.AsyncClient(timeout=15.0) as client:
        for attempt in range(retries):
            try:
                headers = {}
                if idempotency_key:
                    headers["X-Idempotency-Key"] = idempotency_key
                resp = await client.post(target_url, json=payload, headers=headers)
                resp.raise_for_status()
                return resp.json() if resp.content else {}
            except httpx.HTTPError as exc:
                logger.warning("Agent forward failed (%s/%s): %s", attempt + 1, retries, exc)
                if attempt == retries - 1:
                    raise HTTPException(status_code=502, detail=f"Failed to reach agent: {exc}") from exc
                await asyncio.sleep(delay)
                delay *= 2

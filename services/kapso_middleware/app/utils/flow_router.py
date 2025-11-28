import asyncio
import logging
from typing import Any, Dict, Optional

from app.models import NormalizedKapsoEvent
from app.supabase_client import get_supabase

logger = logging.getLogger(__name__)


def _find_pending_campaign(client, owner_id: str) -> Optional[Dict[str, Any]]:
    query = (
        client.table("campaign_proposals")
        .select("id, status")
        .eq("user_id", owner_id)
        .eq("status", "pending")
        .order("sent_at", desc=True)
        .limit(1)
    )
    response = query.execute()
    data = getattr(response, "data", None)
    if isinstance(data, list) and data:
        return data[0]
    return None


async def annotate_flow_from_supabase(event: NormalizedKapsoEvent) -> None:
    """
    If Kapso metadata lacks routing info, use Supabase records to infer that
    the message should be processed by the feedback flow.
    """
    if event.metadata.get("flow"):
        return
    if not event.owner_id:
        return
    client = get_supabase()
    if not client:
        return

    pending = await asyncio.to_thread(_find_pending_campaign, client, event.owner_id)
    if pending:
        logger.info(
            "[KapsoFlowRouter] Detected pending campaign for owner=%s -> feedback flow",
            event.owner_id,
        )
        event.metadata["flow"] = "feedback"
        event.metadata["campaign_proposal_id"] = pending.get("id")

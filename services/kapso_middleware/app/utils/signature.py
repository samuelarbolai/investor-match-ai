import hashlib
import hmac
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException

from app.config import settings


def _coerce_timestamp(timestamp: str) -> datetime:
    """Kapso timestamps may be unix seconds or ISO8601 strings."""
    if timestamp.isdigit():
        return datetime.fromtimestamp(int(timestamp), tz=timezone.utc)
    try:
        return datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    except ValueError as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(status_code=401, detail="Invalid timestamp header") from exc


def _validate_timestamp(timestamp: Optional[str], max_skew_seconds: int) -> None:
    if not timestamp:
        return
    ts = _coerce_timestamp(timestamp)
    now = datetime.now(timezone.utc)
    skew = abs((now - ts).total_seconds())
    if skew > max_skew_seconds:
        raise HTTPException(status_code=401, detail="Kapso signature timestamp expired")


def compute_signature(secret: str, raw_body: bytes, timestamp: Optional[str] = None) -> str:
    """Kapso signs the raw JSON body with HMAC-SHA256."""
    message = raw_body
    if timestamp:
        message = f"{timestamp}.{raw_body.decode('utf-8')}".encode("utf-8")
    return hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()


def verify_signature(
    secret: Optional[str],
    provided: Optional[str],
    raw_body: bytes,
    timestamp: Optional[str] = None,
    max_skew_seconds: Optional[int] = None,
):
    if not secret:
        return
    if not provided:
        raise HTTPException(status_code=401, detail="Missing X-Webhook-Signature")

    max_skew = max_skew_seconds or settings.max_signature_skew_seconds
    _validate_timestamp(timestamp, max_skew)

    expected = compute_signature(secret, raw_body, timestamp)
    if not hmac.compare_digest(expected, provided):
        raise HTTPException(status_code=401, detail="Invalid X-Webhook-Signature")

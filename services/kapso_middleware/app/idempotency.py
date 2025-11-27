import asyncio
import time
from typing import Dict, Optional

from app.config import settings


class InMemoryIdempotencyStore:
    """Simple in-memory store with TTL support for local/dev usage."""

    def __init__(self) -> None:
        self._store: Dict[str, float] = {}
        self._lock = asyncio.Lock()

    async def was_processed(self, key: str) -> bool:
        now = time.time()
        async with self._lock:
            expiry = self._store.get(key)
            if expiry is None:
                return False
            if expiry < now:
                del self._store[key]
                return False
            return True

    async def mark_processed(self, key: str, ttl_seconds: int) -> None:
        expires_at = time.time() + ttl_seconds
        async with self._lock:
            self._store[key] = expires_at

    async def clear(self) -> None:
        async with self._lock:
            self._store.clear()


_IN_MEMORY_STORE = InMemoryIdempotencyStore()


def get_store() -> InMemoryIdempotencyStore:
    # Placeholder for future Redis/Firestore implementations.
    # Until `settings.idempotency_store_url` is wired to a real backend
    # we fall back to an in-memory structure suitable for local tests.
    return _IN_MEMORY_STORE


async def was_processed(key: Optional[str]) -> bool:
    if not key:
        return False
    store = get_store()
    return await store.was_processed(key)


async def mark_processed(key: Optional[str]) -> None:
    if not key:
        return
    store = get_store()
    await store.mark_processed(key, settings.idempotency_ttl_seconds)


async def reset_store() -> None:
    store = get_store()
    await store.clear()

from functools import lru_cache
from typing import Optional

import httpx
from gotrue import http_clients as gotrue_http
from gotrue._sync import gotrue_base_api as sync_base
from supabase import Client, create_client

from app.config import settings


class _PatchedSyncClient(httpx.Client):
    """
    Supabase's SyncClient closes asynchronously when used inside async apps.
    Patch it so FastAPI shutdowns do not raise warnings.
    """

    def __init__(self, *args, proxy=None, **kwargs):
        if proxy is not None:
            kwargs.setdefault("proxies", proxy)
        super().__init__(*args, **kwargs)

    def aclose(self) -> None:
        self.close()


if not getattr(gotrue_http.SyncClient, "_kapso_patch", False):
    _PatchedSyncClient._kapso_patch = True
    gotrue_http.SyncClient = _PatchedSyncClient  # type: ignore
if getattr(sync_base, "SyncClient", None) is not _PatchedSyncClient:
    sync_base.SyncClient = _PatchedSyncClient  # type: ignore


@lru_cache
def _build_client() -> Optional[Client]:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        return None
    return create_client(str(settings.supabase_url), settings.supabase_service_role_key)


def get_supabase() -> Optional[Client]:
    return _build_client()

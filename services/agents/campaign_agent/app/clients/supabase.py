import os
import httpx
from gotrue import http_clients as gotrue_http
from gotrue._sync import gotrue_base_api as sync_base

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
ALLOW_MOCKS = os.environ.get("SUPABASE_ALLOW_MOCKS", "true") == "true"


class _PatchedSyncClient(httpx.Client):
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

from supabase import create_client, Client


def _create_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("Supabase credentials missing")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


class _SupabaseWrapper:
    def __init__(self):
        self._client: Client | None = None
        self._init_error: Exception | None = None
        self._initialize()

    def _initialize(self):
        try:
            self._client = _create_client()
        except Exception as exc:  # pragma: no cover - exercised in tests via mocks
            if not ALLOW_MOCKS:
                raise
            self._init_error = exc
            self._client = None

    def __getattr__(self, item):
        if self._client is None:
            raise RuntimeError("Supabase client not initialized") from self._init_error
        return getattr(self._client, item)


SUPABASE = _SupabaseWrapper()

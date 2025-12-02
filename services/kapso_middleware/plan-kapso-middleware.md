# Kapso Middleware Upgrade Plan

This is the authoritative development guide for finishing the Kapso middleware. Follow it literally. Every step exists to satisfy either the Kapso webhook docs (headers, signatures, retries) or our product goals (single place where all Kapso traffic—webhooks + outbound WhatsApp—passes through). Nothing else should be changed without updating this plan first.

---

## 1. Project Structure & Router Split

### Target layout (FastAPI + HTTPX microservice)
```
app/
├── __init__.py
├── config.py
├── main.py                  # FastAPI app factory
├── models.py                # Kapso raw + normalized payload schemas
├── parser_client.py         # Legacy passthrough (optional)
├── kapso_client.py          # Outbound Kapso HTTP helpers
├── routers/
│   ├── webhooks.py          # /webhooks/kapso (inbound WhatsApp)
│   └── internal.py          # /internal/* (outbound proxy)
├── routers/shared.py        # agent routing helpers
└── utils/
    └── signature.py         # Kapso signature verification helpers
```

### Goals
1. **Single ingress** – `/webhooks/kapso` receives every Kapso webhook, verifies it, normalizes it, and fans out to LangGraph agents. No agent ever receives raw Kapso payloads directly.
2. **Single egress** – `/internal/send-message` + `/internal/conversations/:id` proxy all outbound Kapso calls so the API key only lives here.
3. **Normalized schema** – agents receive `NormalizedKapsoEvent` objects that already include owner/contact IDs, phone numbers, metadata, and the `X-Idempotency-Key`.

---

## 2. Models & Normalization

### `app/models.py`
1. Implement Kapso’s documented payload schemas:
   - `KapsoMessage`, `KapsoConversation`, `KapsoEventEntry`, `KapsoBatchPayload`, `KapsoConversationEventPayload`, `KapsoWebhook`.
   - Preserve all Kapso fields (`kapso.direction`, `metadata`, `phone_number_id`, etc.).
2. Add a `NormalizedKapsoEvent`:
   ```python
   class NormalizedKapsoEvent(BaseModel):
       event_type: str
       conversation_id: str
       owner_id: str | None
       contact_id: str | None
       phone_number: str | None
       phone_number_id: str | None
       messages: list[NormalizedMessage]
       metadata: dict[str, Any]
       headers: dict[str, str]
       idempotency_key: str | None
   ```
3. Implement `KapsoWebhook.to_normalized(headers: dict[str, str]) -> NormalizedKapsoEvent` which:
   - Accepts the header dict from FastAPI.
   - Copies `X-Webhook-Event`, `X-Webhook-Payload-Version`, `X-Webhook-Batch`.
   - Extracts the useful fields (conversation ID, phone number, etc.).
   - Emits inbound/outbound flags so agents know whether the message was from user or Kapso agent.

---

## 3. Environment & Settings

### Required env vars (`app/config.py`)
| Variable | Description |
| --- | --- |
| `KAPSO_API_KEY` | Kapso API key for outbound calls. |
| `KAPSO_BASE_URL` | Defaults to `https://app.kapso.ai/api/meta/`. |
| `KAPSO_WEBHOOK_SECRET` | Verifies `X-Webhook-Signature`. |
| `AGENT_ONBOARDING_URL` | Cloud Run URL for onboarding agent. |
| `AGENT_CAMPAIGN_URL` | Cloud Run URL for campaign agent. |
| `AGENT_FEEDBACK_URL` | Cloud Run URL for feedback agent. |
| `AGENT_SETTER_URL` | Cloud Run URL for setter agent (future but must exist). |
| `PARSER_URL` / `PARSER_API_KEY` | Only if we still need to forward transcripts to the legacy parser. |
| `LOG_BODIES` | `true` to log entire payloads (dev only). |
| `IDEMPOTENCY_STORE_URL` | Optional Redis/Firestore connection string for dedupe. |

Document these in `.env.example` and Secret Manager.

---

## 4. Webhook Pipeline (`app/routers/webhooks.py`)

### Request flow (per Kapso docs)
1. **Read headers** – capture `X-Webhook-Event`, `X-Webhook-Signature`, `X-Idempotency-Key`, `X-Webhook-Payload-Version`, `X-Webhook-Batch`, and `X-Webhook-Timestamp` (if Kapso includes it).
2. **Signature verification** – call `verify_signature(settings.kapso_webhook_secret, signature, raw_body, timestamp)` before parsing. Missing/invalid headers return `401` immediately.
3. **Parse raw JSON** – feed the raw string into `KapsoWebhook.parse_raw_payload`; log errors with the idempotency key.
4. **Deduplicate** – check `X-Idempotency-Key`. If we’ve processed it (store with TTL > 3 minutes to cover Kapso’s 10s/40s/90s retry cadence), return `{"status":"already-processed"}` with 200 and skip agent forwarding.
5. **Normalize** – call `payload.to_normalized(headers_dict)` so downstream always receives the same structure.
6. **Classify + route** – add helper `classify_event(normalized)` that inspects `normalized.metadata["flow"]`, campaign tags, or event types. Map to `settings.agent_*_url`. No brittle substring checks.
7. **Forward** – use `forward_to_agent(url, normalized_event)` with HTTPX, 3 attempts, exponential backoff (1s/2s/4s). All retries must fit within 10 seconds to keep Kapso from retrying us automatically.
8. **Respond** – return `{ "status": "queued" }` (plus optional debug info when `LOG_BODIES=true`). Fast response time is critical: Kapso expects 200 <10s, otherwise retries automatically (10s, 40s, 90s).

### Additional requirements
- Log structured context (`idempotency_key`, `conversation_id`, `event_type`, `agent_url`) for every request.
- If forwarding ultimately fails, raise `HTTPException(502, detail=...)` so Kapso retries and we get another chance.
- If the parser flow is still needed, gate it behind a feature flag (e.g., `FORWARD_TO_PARSER=true`) so normal operation is just Kapso → middleware → agents.

---

## 5. Internal APIs (`app/routers/internal.py`)

### Endpoints
1. `POST /internal/send-message`
   - Body: `{ "phone_number_id": str, "to": str, "body": str }`
   - Calls `kapso_client.send_text(...)`.
2. `GET /internal/conversations/{conversation_id}`
   - Calls `kapso_client.fetch_conversation(...)`.

### Requirements
- Optionally require an `X-Internal-Token` header so only trusted agent services can call these endpoints.
- Log outbound traffic with `[KapsoOutbound]` prefix including phone number IDs and Kapso response status codes.
- Surface Kapso HTTP errors verbatim (status + response body) so agents can handle them gracefully.

---

## 6. Signature Utility (`app/utils/signature.py`)

### Implementation
```python
def compute_signature(secret: str, raw_body: bytes, timestamp: str | None = None) -> str:
    msg = raw_body if not timestamp else f"{timestamp}.{raw_body.decode('utf-8')}".encode("utf-8")
    return hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()

def verify_signature(secret: str | None, provided: str | None, raw_body: bytes, timestamp: str | None = None):
    if not secret:
        return  # allow dev mode
    if not provided:
        raise HTTPException(status_code=401, detail="Missing X-Webhook-Signature")
    if timestamp:
        validate_timestamp_skew(timestamp, max_skew_minutes=5)
    expected = compute_signature(secret, raw_body, timestamp)
    if not hmac.compare_digest(expected, provided):
        raise HTTPException(status_code=401, detail="Invalid Kapso signature")
```
Add `validate_timestamp_skew` to reject requests older than ~5 minutes and log all rejected attempts.

---

## 7. Idempotency Store

Kapso sends `X-Idempotency-Key` for every webhook. We must persist processed keys for at least the retry window (~3 minutes) to avoid duplicate work.

1. Implement `idempotency.py` with:
   ```python
   async def was_processed(key: str) -> bool: ...
   async def mark_processed(key: str) -> None: ...
   ```
2. Default implementation can be in-memory (`asyncio.Lock` + dict) for local dev.
3. Production should use Redis, Firestore, or Supabase (anything with TTL support).
4. Integration tests should cover both first-time and duplicate behavior.

---

## 8. Testing Plan

1. **Unit tests**
   - `tests/test_signature.py`: valid signatures, invalid signatures, missing headers, timestamp skew.
   - `tests/test_idempotency.py`: ensures keys expire and duplicates short-circuit.
2. **Router tests (`tests/test_webhooks.py`)**
   - Valid Kapso webhook (batched + single) routes to correct agent URL, respects retries, and returns 200 <10s.
   - Invalid signature → 401, no agent call.
   - Duplicate `X-Idempotency-Key` → second call returns already-processed and does not forward.
   - Missing headers (e.g., no `X-Webhook-Event`) → 400 with descriptive error.
3. **Internal API tests**
   - `/internal/send-message` forwards payload to Kapso client and bubbles HTTP errors.
   - `/internal/conversations/:id` proxies GET and handles 404/500 responses cleanly.
4. **Smoke script**
   - `scripts/send_sample_webhook.py` loads a Kapso sample payload, signs it with `KAPSO_WEBHOOK_SECRET`, and posts to the local FastAPI server so we can manually verify the logs.

CI (`pytest`) must run under `services/kapso_middleware` before every deploy.

---

## 9. Deployment Checklist

1. Update Secret Manager / `.env` with every required variable (Kapso keys, webhook secret, agent URLs, internal token, idempotency store config).
2. `cd services/kapso_middleware && pip install -r requirements.txt && pytest`.
3. Deploy to Cloud Run (`gcloud run deploy kapso-middleware --source . ...`).
4. Re-register the Cloud Run URL inside Kapso (Sidebar → Webhooks). Use HTTPS and copy the new secret.
5. Ping each agent team so they know to call the middleware for all Kapso interactions; direct Kapso access is now forbidden.
6. Verify end-to-end by sending a test webhook from Kapso → middleware → agent, and by sending a test outbound message via `/internal/send-message`.

Once these steps are complete, the Kapso middleware will:
- Accept all WhatsApp webhooks with verified signatures.
- Fan out normalized payloads to the correct LangGraph agents.
- Expose stable internal APIs for outbound WhatsApp messaging and conversation retrieval.
- Enforce idempotency, logging, and retry semantics exactly as Kapso’s docs specify.

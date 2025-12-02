## Kapso Middleware – Transport Layer Contract

This service is intentionally thin. It does **not** run business logic, LangGraph agents, or persistence writes. Its responsibilities:

1. **Inbound Webhooks**
   - Verify Kapso signatures and timestamps.
   - Normalize payloads (flatten batch envelopes, map Kapso IDs → Investor Match owner/contact IDs).
   - Attach routing metadata (e.g., `event_type`, `conversation_id`, `owner_slug`).

2. **Fan-out to Agent Services**
   - Forward normalized JSON to the correct agent HTTP endpoint:
     - `/agents/onboarding/inbound` – handles onboarding or campaign proposal prompts.
     - `/agents/campaign/inbound` – sends new prospect lists / “outreached” updates.
     - `/agents/feedback/inbound` – ingests replies that include approvals, rejections, or qualitative feedback.
     - `/agents/setter/inbound` – scaffolded; activates once the setter agent goes live.
   - Retry with exponential backoff (3 attempts) before surfacing an error log; agents expose idempotent endpoints.

3. **Outbound Kapso Calls (Optional)**
   - Provide small helper utilities (`kapso_client.py`) so agents can re-use auth-configured Kapso SDK clients by making internal HTTP requests back to the middleware (e.g., `/internal/send-message`). This keeps API keys centralized.

### Folder Layout

```
services/kapso_middleware/
├── app/
│   ├── main.py              # FastAPI router (webhooks + fan-out)
│   ├── schemas.py           # Pydantic models for normalized events
│   ├── routers/
│   │   ├── webhooks.py
│   │   └── internal.py      # optional helper endpoints
│   └── clients/
│       └── kapso.py         # direct Kapso API client (send/read messages)
└── tests/
```

### Environment Variables

| Variable | Description |
| --- | --- |
| `KAPSO_API_KEY` | Shared Kapso API key (single tenant for now). |
| `KAPSO_BASE_URL` | Defaults to `https://app.kapso.ai/api/meta/`. |
| `AGENT_{NAME}_URL` | Target URL for each agent service (Cloud Run HTTPS). |
| `PARSER_URL` / `PARSER_API_KEY` | Existing parser forwarding config. |
| `LOG_BODIES` | Enable verbose webhook logging. |

### When to Change This Service

- **DO** add new routing rules when Kapso introduces new webhook events.
- **DO** extend schemas if agents need additional normalized fields.
- **DON’T** embed business logic or Supabase writes here; keep that inside `services/agents/*`.
- **DON’T** bypass the middleware by pointing Kapso webhooks directly at agents—centralized validation keeps the system reliable.

### Internal APIs

- `POST /internal/send-message`: accepts `{ "phone_number_id", "to", "body" }` and forwards the payload to Kapso’s `messages` endpoint.
- `GET /internal/conversations/{id}`: proxies Kapso’s conversation fetch so agents can retrieve historical context.

### Run & Test
- Local dev: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- Dependencies: Python 3.11+, `pip install -r requirements.txt`
- Add pytest coverage before shipping new routes; use synthetic webhook fixtures.

### Environment Variables
- `KAPSO_API_KEY` (required)
- `KAPSO_WEBHOOK_SECRET` (signature verification)
- `KAPSO_BASE_URL`, `KAPSO_WHATSAPP_BASE_URL` (defaults set)
- `AGENT_ONBOARDING_URL`, `AGENT_CAMPAIGN_URL`, `AGENT_FEEDBACK_URL`, `AGENT_SETTER_URL`
- `PARSER_URL`, `PARSER_API_KEY` (optional forwarding)
- `FORWARD_TO_PARSER` (bool)
- `IDEMPOTENCY_STORE_URL`, `IDEMPOTENCY_TTL_SECONDS`
- `INTERNAL_ACCESS_TOKEN` (protects `/internal/*`)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SCHEMA`
- `LOG_BODIES` (verbose logging), `MAX_SIGNATURE_SKEW_SECONDS`

### API / Interfaces
- `POST /webhooks/kapso` – primary webhook ingress (requires Kapso signature headers)
- `POST /internal/send-message` – proxy to Kapso send API (requires `X-Internal-Token` when configured)
- `GET /internal/conversations/{id}` – fetch Kapso conversation (internal token)
- `GET /health` – health check

### Sample Requests
- Live (replace base URL and headers):  
```bash
curl -X POST https://<cloud-run-url>/webhooks/kapso \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: <kapso-signature>" \
  -H "x-webhook-timestamp: <ts>" \
  -d '{"event":"whatsapp.message.received","data":{...}}'
```
- Local (signature off for manual smoke):  
```bash
curl -X POST http://localhost:8000/webhooks/kapso \
  -H "Content-Type: application/json" \
  -d '{"event":"whatsapp.message.received","data":{}}'
curl http://localhost:8000/health
```
- Internal send-message (with token if set):  
```bash
curl -X POST http://localhost:8000/internal/send-message \
  -H "Content-Type: application/json" \
  -H "X-Internal-Token: <token>" \
  -d '{"phone_number_id":"123","to":"+15551231234","body":"hello"}'
```

### Project Structure
- `app/main.py` – FastAPI entrypoint
- `app/routers/webhooks.py` – Kapso webhook handling
- `app/routers/internal.py` – internal proxy endpoints
- `app/config.py` – settings/env
- `app/utils/` – signature verification, flow routing, idempotency
- `app/models.py` – payload parsing/normalization

### Testing
- Add pytest suites with recorded webhook fixtures; mock Kapso HTTP calls and Supabase.

### Logging & Monitoring
- Logging via `logging` module; `LOG_BODIES` toggles payload logging.
- Health endpoint: `/health`. Apply repo-level monitoring queries from `docs/monitoring/` to this service when deployed.

### Deployment Notes
- Deploy to Cloud Run; set secrets for Kapso keys, webhook secret, Supabase, and internal token.
- Keep Kapso API keys centralized here; agents should not store them.

### Do / Don’t Change
- Don’t embed business logic or Supabase writes here; keep it transport-only.
- Don’t bypass middleware by pointing Kapso webhooks directly to agents.
- Do extend routing/schemas as new Kapso events appear.

## Kapso Middleware – Transport Layer Contract

This service is intentionally thin. It does **not** run business logic, LangGraph agents, or persistence writes. Its only responsibilities are:

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

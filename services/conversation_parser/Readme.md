## Conversation Parser

FastAPI service that ingests a conversation transcript, uses an LLM to classify the action, and forwards a POST/PATCH to the Investor Match API.

### Tech / Runtime
- Python 3.11+, FastAPI, OpenAI client, Pydantic.

### Prerequisites
- Python 3.11+
- OpenAI API key
- Investor Match API base/auth token (for outbound calls)

### Setup & Install
```bash
pip install -r requirements.txt
```

### Run / Dev
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Commands
- Run: `uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload`
- Tests: add `pytest` (fixtures recommended) when modifying prompts/routing.

### Environment Variables
- `OPENAI_API_KEY` (required)
- `INVESTOR_MATCH_API_BASE` (defaults to production URL)
- `INVESTOR_MATCH_API_AUTH_TOKEN` (optional bearer token)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (the prompt loader queries `agent_prompts`; these must be present so prompts can be fetched)
- `SUPABASE_ALLOW_MOCKS=false` (fail fast if prompts are missing)

### API / Interfaces
- `POST /v1/conversations` – classify transcript and forward to Investor Match API (uses the Supabase `agent_prompts` `conversation_parser` rows for system/user prompts; missing rows now raise).
- `GET /health` not present; rely on server status/uvicorn exit codes for now.

### Sample Requests
- Live (prod base):  
```bash
curl -X POST https://investor-match-api-23715448976.us-east1.run.app/v1/conversations \
  -H "Content-Type: application/json" \
  -d '{"conversation":"Founder chatted with investor about fintech."}'
```
- Local:  
```bash
curl -X POST http://localhost:8001/v1/conversations \
  -H "Content-Type: application/json" \
  -d '{"conversation":"Founder chatted with investor about fintech."}'
```

### Project Structure
- `app/main.py` – FastAPI entrypoint and request logging.
- `app/services.py` – LLM decision plus outbound API calls.
- `app/models.py` – Pydantic models for request/response payloads.
- `app/config.py` – API base/auth headers.

### Testing
- Add pytest coverage when modifying prompts or routing; seed transcripts in `tests/` fixtures for deterministic runs.

### Logging & Monitoring
- Logs requests/LLM decisions to stdout and prints `[ConversationParser] running (print check)` at startup. Outbound API calls include an `Idempotency-Key`, 10s timeout, and retries/backoff on 5xx/HTTP errors; company payloads normalize `company_name` → `name` before sending.
- Follow repo `docs/monitoring/` guidance if adding health/metrics endpoints.

### Deployment Notes
- Cloud Run compatible; set OpenAI/API creds via secrets.

### Do / Don’t Change
- Keep outbound auth/token handling centralized in `app/config.py`.
- Don’t hardcode secrets; rely on env vars.

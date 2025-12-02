# Code Agent Context (Investor Match Backend)

## Project Overview
- Multi-service repository; every deployable service lives under `services/` and ships in its own container. No root monolith.
- Core API (Express + TypeScript) in `services/investor-match-api/` (rich Jest suites and data scripts).
- Supporting Python services: Kapso webhook middleware, WhatsApp master agent, and conversation parser.

## Project Modules
- Investor Match API: `services/investor-match-api/` (primary API with tests and seeding/backfill scripts).
- Kapso middleware: `services/kapso_middleware/` (FastAPI transport for Kapso webhooks).
- WhatsApp master agent: `services/agents/master_agent/` (FastAPI + LangGraph + Supabase).
- Conversation parser: `services/conversation_parser/` (FastAPI + OpenAI router).
- Reference docs/schemas: `docs/`, `postman/`, `vibe-coding/data_model_schema.md`, `DataBaseSchema/`.

## Modules Overviews
- `services/investor-match-api/`: Contacts CRUD, matching, introductions workflow; Firestore-backed; Joi validation; Jest coverage; seeding/backfill scripts (`seed:vocabs`, `seed:coverage-contacts`, `backfill:nodes`, `recompute:stage-counts`).
- `services/kapso_middleware/`: Verifies Kapso signatures, normalizes events, routes to agents, optional parser forwarding; internal proxies for send-message and conversation fetch; idempotency guard.
- `services/agents/master_agent/`: LangGraph flows (`onboarding`, `campaign_proposal`, `feedback`, `setter`), Supabase persistence, Kapso-normalized ingress, Pub/Sub stage-event ingestion.
- `services/conversation_parser/`: LLM-assisted POST vs PATCH router to the API; requires OpenAI key and API base/auth.

## Project Architecture (Flow)
1) Investor Match API handles contacts/matching/introductions and writes to Firestore with reverse indexes.  
2) Stage updates can fan out (Pub/Sub) and be consumed by the master agent.  
3) Kapso middleware normalizes WhatsApp webhooks → forwards to master agent → agent can reply via Kapso and persist to Supabase → optional calls back into the API.  
4) Conversation parser classifies transcripts and forwards structured requests to the API.  
5) Monitoring/runbook/testing docs live under `docs/`; Postman collections in `postman/`.

## Module Structure (Directories & Files)
- `services/investor-match-api/`: `src/` (handlers/routes/services/validators), `tests/` (unit/integration/load), `scripts/` (seed/backfill), `package.json`.
- `services/kapso_middleware/`: `app/main.py`, `app/routers/{webhooks,internal}.py`, `app/config.py`, `app/utils/*`, `requirements.txt`.
- `services/agents/master_agent/`: rebuilt in JS (Node/Express): `server.js`, `routes/{messages,conversations}.js`, `lib/{supabase.js,state.js,llm.js,prompt.js}`, static UI `public/chat.html`, `.env` preserved; legacy langgraph/Python removed except `app/clients/supabase.py` kept for reference.
- `services/conversation_parser/`: `app/main.py`, `app/services.py`, `app/models.py`, `app/config.py`, `requirements.txt`.
- Docs: `docs/RUNBOOK.md`, `docs/monitoring/*`, `docs/testing-plan-v2.md`, `docs/schema-migration-checklist.md`, data model references in `vibe-coding/data_model_schema.md` and `DataBaseSchema/`.

## Module Files (Purpose & Pointers)
- API configs/logic/tests: `services/investor-match-api/src/config/*.ts`, `.../src/services/*`, `.../tests/**`, `.../scripts/*.ts`.
- Middleware routing/signature/idempotency: `services/kapso_middleware/app/routers/webhooks.py`, `app/utils/signature.py`, `app/idempotency.py`.
- Agent flows/persistence: `services/agents/master_agent/app/flows/*.py`, `app/clients/supabase.py`, `app/graph.py`, `app/chat/store.py`.
- Parser LLM routing: `services/conversation_parser/app/services.py`.

## Standing Instructions
1) Share a plan before edits; ask for missing context; wait for confirmation.  
2) Never revert user changes without explicit direction.  
3) Keep `current-plan.md` and this file aligned after material updates.  
4) When updating any doc (including this file), conform exactly to the SDK template sections and headings; do not add ad-hoc sections. If a field is unclear, propose the clarification first, then apply uniformly.

## Next Steps (when updating code/docs)
- Update affected module README(s) when commands/env/interfaces change.  
- If schema changes, sync `vibe-coding/data_model_schema.md`, `DataBaseSchema/`, and Postman collections.  
- Log material decisions in `current-plan.md`; follow testing guidance below.

## Testing & Verification
- Investor Match API: `npm test`, `npm run test:unit`, `npm run test:integration`, emulator via `npm run emulator:start` + `npm run test:integration:emulator`, load tests in `tests/load`; use seeding/backfill scripts as needed.  
- Kapso middleware: run with `uvicorn ... --reload`; add pytest coverage with webhook fixtures.  
- Master agent: `pytest` (async; fixtures in `tests/data`).  
- Conversation parser: `uvicorn ... --reload`; add pytest when changing prompts/routing.

## Operational References
- Monitoring/runbook/testing: `docs/monitoring/*`, `docs/RUNBOOK.md`, `docs/testing-plan-v2.md`, `docs/schema-migration-checklist.md`.  
- Secrets stay out of repo: Firebase service accounts, Supabase keys, Kapso keys, OpenAI keys → use `.env` locally, Cloud Run secrets in deployment.

- **Master Agent (JS rebuild)**
- Entry: `server.js` (Express) exposes `/messages`, `/conversations`, `/agents/whatsapp/inbound`, `parser` proxy, and the static `/chat.html` UI.
- Prompts: every route loads the latest `agent_prompts` (columns `agent_name`, `prompt_type`, `language`, `content`, `updated_at`) with `prompt_type='system'`; missing rows throw a hard error so your deployment fails fast if the prompt isn’t provisioned.
- Conversation persistence: `lib/state.js` now records the Kapso metadata (external ID, phone, owner, contact) so repeated messages append to the same Supabase conversation ID. Each request also logs `[master-agent] version=1.0.0 method=...`.
- Parser integration: after every reply the agent hits `PARSER_URL` (production parser) and includes the parser response in the `/agents/whatsapp/inbound` JSON; the parser proxies remain (and you can still call `/parser` manually). Readme documents the new flows.
- Deployment note: Dockerfile now just installs dependencies and runs `node server.js`, and we log the package version for every request. Use the cURL/Cloud Run commands in the plan to deploy.
- LLM judge: legacy Python judge retained for future rewire; not yet connected to the new JS message store.
- Commands (JS): `cd services/agents/master_agent && npm install && node server.js`; send message via `curl -X POST http://localhost:8080/messages -H "Content-Type: application/json" -d '{"content":"Hi"}'`.
- Prompts: loaded from Supabase `agent_prompts` (columns: agent_name, prompt_type, language, content, updated_at). `/messages` loads latest `prompt_type='system'` for the requested `agentSlug` (default onboarding); fails hard if missing. Add rows for onboarding/campaign/feedback/setter.
- Chat UI: `http://localhost:8080/chat.html` (static).

## Conversation Parser (prompt loading)
- `app/prompt_loader.py` fetches prompts from `agent_prompts` (agent_name/prompt_type/language) and now fails hard if missing (no fallback). Requires prompt rows in Supabase (e.g., agent_name `conversation_parser`, prompt_type `system` or `user`).
- Logs `[ConversationParser] running (print check)` on startup to make the running revision easy to spot in Cloud Run logs.

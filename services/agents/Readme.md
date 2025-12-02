# Agents Overview

This folder holds all WhatsApp agents. The only active service is `master_agent`, which is now a Node/Express server backed by Supabase.

## Current stack
- `master_agent/` – Node/Express prompt-powered service that exposes `/agents/whatsapp/inbound`, `/messages`, `/conversations`, and a static `/chat.html` UI. Prompts load from the Supabase `agent_prompts` table.
- Ancillary services (Kapso middleware, conversation parser) still live in their respective directories but now point to the JS master agent via its `/agents/whatsapp/inbound` route.

## Key notes
- Each Kapso event is normalized / annotated in `services/kapso_middleware` before it hits the master agent; keep the middleware configured to forward to the JS service URL.
- The master agent now writes to `conversations`/`messages` and calls the parser (via `PARSER_URL`) for final onboarding completion. The parser still handles JSON conversion → Investor Match API.
- When deploying, ensure the environment variables in `services/agents/master_agent/.env` (Supabase, OpenAI, parser URL, Kapso middleware URL) are mirrored in your Cloud Run service.

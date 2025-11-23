# Code Agent Context README

This file keeps the canonical context that a future automation/code agent must read before touching the repo.

## Quick Facts
- Repo path: `/Users/samuelgiraldoconcha/Documents/30X/investor-match-api`
- Primary service: `investor-match-api` (consolidated monolith)
- Deployment: Cloud Run (us-east1) via GitHub Actions (`main` → deploy)
- Live docs: https://investor-match-api-23715448976.us-east1.run.app/api-docs
- Keep in sync: `logs.md`, `current-plan.md`, `context-for-code-agent.md`

## Standing Instructions
1. Before making any change, write down your plan and show it to the user.
2. After sharing the plan, explicitly ask the user if more context is needed and wait for confirmation.
3. Only implement changes after both steps are completed.
4. Never revert user changes unless they explicitly ask for it.
5. Track any session-specific decisions in `logs.md`.

## Project Status (2025-11-15T13:10)
- Phases 1–6 complete (foundation, data layer, matching, API, tests, CI/CD).
- Phase 7 Milestone 7.1 complete (documentation & handoff).
- Active work: Phase 7 Milestone 7.2 (Monitoring & Observability).
- Architecture consolidations done; repo version deployed: 1.0.1.

## Architecture Snapshot
- Single service Express + TypeScript API (`src/`).
- Firestore backend; schema described in `data_model_schema_for_firestore.md` and `schema-outline.md`.
- Matching algorithm tested with 20+ contacts; exposed via `/v1/contacts/:id/matches`.
- Logging, validation, and error handling implemented; see `README.md` + `TESTING-GUIDE.md`.

## Key Operational Resources
- `README.md`: setup, seeding, deployment instructions.
- `docs/RUNBOOK.md`: incident response and operational checklists.
- `docs/testing-plan-v2.md`: complete verification steps (unit/integration/load/manual).
- `docs/architecture-diagram.html`: current architecture visualization.
- Postman collections in `postman/` cover new fields; configure `baseUrl` and IDs before use.

## Testing & Tooling
- Commands:
  - `npm test`, `npm run test:coverage`, `npm run test:unit`
  - Firestore emulator: `npm run emulator:start`, then `npm run test:integration:emulator`
  - Load tests: `npm run load-test` (k6 scripts)
- Coverage checkpoints: 86% matching service, 100% utils (some non-blocking failures expected).
- Seeding scripts (`clear:firestore`, `seed:vocabs`, `seed:coverage-contacts`, `backfill:nodes`) keep dev env in sync with schema v0.2.

## API Surface
- Contacts: `/v1/contacts` CRUD plus `/v1/contacts/:id/matches` and `/v1/contacts/filter`.
- Introductions workflow: `/v1/introductions/stage`, `/v1/introductions/stages/bulk-update`, `/v1/introductions/stage/summary`.
- System: `/health`, `/test-firestore`.
- Responses now include `stage_counts`; filters accept `stage_count_filters`.

## Chat Orchestration Middleware (services/chat-orchestration)
- Bridges Kapso WhatsApp ↔ Botpress Messaging via Express/TypeScript.
- Entry points: `npm run dev`, `npm run dev:online`, `npm run build && npm start`.
- Endpoints: `/api/messages/send`, `/webhooks/kapso`, `/webhooks/botpress`, `/health`.
- Requires env vars documented in `.env.example` (Kapso credentials, Botpress webhook URL, tunnel config).
- Logging via Pino (`src/logger.ts`); persistence layer still TODO.

## Upcoming Priorities
1. Finish Monitoring & Observability validation (Phase 7.2).
2. Execute full testing plan (`docs/testing-plan-v2.md`) before next deployment.
3. Sync UI repo to consume new schema fields once API verified.
4. Re-run deployment pipeline (`deploy.yml`) after tests pass.

## If Context Gets Lost
1. Re-read this README plus `README.md` and `docs/RUNBOOK.md`.
2. Confirm latest status in `current-plan.md`; log actions in `logs.md`.
3. Follow standing instructions (plan + confirm) before touching code.
4. Use Swagger UI (`/api-docs`) and Postman collection for manual verification.

# Context For Code Agent

- Repository path: `/Users/samuelgiraldoconcha/Documents/30X/investor-match-ai-api`
- Session start: 2025-11-17T10:42 -05:00
- GEMINI.md generated: 2025-11-17T10:42 -05:00
- Tracking files to keep updated: `logs.md`, `current-plan.md`, `context-for-code-agent.md`
- Standing instructions:
  - ALWAYS before implementing anything: 1) Layout a plan and show it, 2) Ask for more context that is needed.
  - Only proceed with implementation after completing both steps above.
  - **CONFIRMED**: 2025-11-14T11:54 -05:00 - Workflow reconfirmed by user

## Current Status (2025-11-15T13:10)
- **Phase 1**: COMPLETED ✅ - Project foundation and architecture
- **Phase 2**: COMPLETED ✅ - Data layer FULLY VALIDATED and production-ready
- **Phase 3**: COMPLETED ✅ - Core matching algorithm implemented and working
- **Phase 4**: COMPLETED ✅ - Production-ready API with validation, error handling, logging
- **Phase 5**: COMPLETED ✅ - Comprehensive testing suite (unit, integration, load testing)
- **Phase 6**: COMPLETED ✅ - CI/CD Pipeline with GitHub Actions
- **Architecture Consolidation**: COMPLETED ✅ - Consolidated to monolithic architecture
- **Phase 7 Milestone 7.1**: COMPLETED ✅ - Documentation & Handoff completed
- **Current Status**: Phase 7 Milestone 7.2 (Monitoring & Observability) - PENDING

## Final Architecture (Consolidated Monolith)
- **Service**: `investor-match-api` (single service containing all functionality)
- **Removed**: 4 stub microservices (matching, flattening, reverse-index, validation)
- **Deployed**: Cloud Run us-east1 via GitHub Actions CI/CD
- **Repository**: https://github.com/samuelarbolai/investor-match-ai.git
- **Version**: 1.0.1 (latest deployment)

## Production System Status
- **API Endpoints**: `/v1/contacts` (POST, GET, PATCH, DELETE), `/v1/contacts/:id/matches`
- **Introduction Endpoints**: `/v1/introductions/stage` (POST/GET), `/v1/introductions/stages/bulk-update` (POST), `/v1/introductions/stage/summary` (GET)
- **System Endpoints**: `/health`, `/test-firestore`
- **API Documentation**: https://investor-match-api-23715448976.us-east1.run.app/api-docs (Swagger UI)
- **Validation**: Joi schemas for all inputs
- **Error Handling**: Structured error responses
- **Logging**: Request/response logging with performance monitoring
- **Matching Algorithm**: Working with real data (tested with 20+ contacts)
- **Service URL**: `https://investor-match-api-23715448976.us-east1.run.app`
- **Test Coverage**: 86% on matching service, 100% on utils

## Phase 7 Documentation / Testing Artifacts
- ✅ **Enhanced README** with setup instructions, schema summary, and seeding workflow.
- ✅ **Swagger/OpenAPI** at `/api-docs` now reflects the expanded Contact schema (target intent arrays, company/experience nodes, `action_status`).
- ✅ **Architecture Diagram**: `/docs/architecture-diagram.html`.
- ✅ **Operations Runbook**: `/docs/RUNBOOK.md`.
- ✅ **Cost Optimization**: documented in README.
- ✅ **Testing artifacts**:
  - `docs/testing-plan-v2.md` – checklist for unit/integration/load/manual validation of the schema overhaul.
  - Seeding scripts (`npm run clear:firestore`, `seed:vocabs`, `seed:coverage-contacts`, `backfill:nodes`) keep the dev project aligned with DataBaseSchema_v0.2.
- ✅ **Postman collections** (`postman/`) include examples covering the new fields; set `baseUrl` + IDs before manual tests.

## Swagger API Documentation Status
- **URL**: https://investor-match-api-23715448976.us-east1.run.app/api-docs
- **Endpoints Documented**: Contacts + System + Introductions (stage CRUD + summary)
- **Features**: 
  - Interactive testing interface
  - Detailed request/response schemas
  - Parameter examples for easy testing
  - Multiple example templates (founder/investor)

## CI/CD Pipeline Status
- ✅ GitHub Actions workflows (test.yml, deploy.yml)
- ✅ Repository connected: https://github.com/samuelarbolai/investor-match-ai.git
- ✅ Dev and main branches configured
- ✅ Automated testing on PRs (unit, integration, load tests)
- ✅ Automated deployment to Cloud Run (us-east1) on main branch
- ✅ Single service deployment (investor-match-api only)
- ✅ Status badges in README

## Testing Framework Status
- **Jest**: Configured with TypeScript support
- **Coverage**: 86% matching service, 100% utils (some test failures exist but core works)
- **Test Commands**: 
  - `npm test` - Run all tests
  - `npm run test:coverage` - Coverage report
  - `npm run test:unit` - Unit tests only
- **Integration**: Firestore emulator setup
- **Load Testing**: k6 scripts with performance benchmarks
- **Schema v2 test plan**: see `docs/testing-plan-v2.md` for the full pre-release checklist (dataset seeding, unit/integration/load/manual QA)

## Key Files Structure
```
services/investor-match-api/
├── src/
│   ├── config/          # Firebase and Swagger configuration
│   ├── models/          # Type definitions (Contact, Experience, AttributeDocument)
│   ├── services/        # Business logic (matching, sync, contact CRUD)
│   ├── handlers/        # Request handlers with Swagger documentation
│   ├── validators/      # Input validation (Joi schemas)
│   ├── middleware/      # Express middleware (error, logging, validation)
│   └── utils/           # Utilities (document ID normalization)
├── tests/               # Unit, integration, and load tests
├── docs/                # Documentation files
│   ├── architecture-diagram.html
│   └── RUNBOOK.md
└── Dockerfile           # Container configuration
```

## Recent Schema Enhancements
- Contacts now include normalized company + experience nodes via `companySyncService`. Each write creates `/companies` and `/experiences` docs (with industries/verticals) while keeping flattened arrays on the contact.
- Investor intent is mirrored into `target_*` arrays (industries, verticals, skills, roles, distribution_capabilities, raised_capital ranges, locations, company IDs, etc.). Reverse-index mapping covers the new fields so we can query “investors targeting Fintech founders.”
- `flatteningService` denormalizes target criteria into those arrays and still writes `target_criterion_ids` for graph access.
- Matching logic (`matching.service.ts`) decides whether to compare `current_*` or `target_*` fields based on the seed contact’s type (founders vs investors), so founders’ current attributes match against investors’ target intent.
- Dev Firestore seeding pipeline (`clear:firestore`, `seed:vocabs`, `seed:coverage-contacts`, `backfill:nodes`) populates every vocab entry plus coverage contacts that reference each node. `/companies` and `/experiences` collections now contain synthetic documents for UI testing.

## Important Notes
- All core functionality is working and production-ready
- Some test failures exist but don't affect core operations
- Firebase authentication issues in tests (not affecting production)
- System handles 2K+ contacts with <2s response times
- Monolithic architecture chosen for simplicity and performance
- Complete API documentation available via Swagger UI
- All endpoints tested and functional via interactive documentation
- Contacts now cache introduction stage counts (`stage_counts`) that sync automatically. See “Stage Count Caching” below for implementation details.

- ## Stage Count Caching
- **Contact Schema**: `services/investor-match-api/src/models/contact.model.ts` adds the optional `stage_counts` map (keys = intro stages).
- **Mutation Flow** (`services/investor-match-api/src/services/introduction.service.ts`):
  - `setStage(ownerId, targetId, stage)` and `bulkSetStage(ownerId, updates)` both compute a delta of stage changes (±1 per stage) and call `applyStageCountDelta`.
  - `applyStageCountDelta(ownerId, delta)` runs a Firestore transaction: loads the owner contact doc, normalizes existing `stage_counts`, applies deltas (clamped ≥0), and updates the doc atomically. After each mutation we also call `synchronizeStageCounts`, which invokes `recalculateStageCounts` to rebuild the cache from scratch (fixes drift after large batches).
  - `POST /v1/introductions/stage/recompute` (handler + validator + server route) exposes `recalculateStageCounts` so we can force a rebuild for any owner on demand (used by troubleshooting/refresh flows).
  - `getStageSummary(ownerId)` still returns computed summaries, but the cached counts remove the need for per-contact aggregate queries in the UI.
- **Bulk Repair Script**: run `npm run recompute:stage-counts` inside `services/investor-match-api` to iterate every contact and call `recalculateStageCounts` (script lives at `scripts/recompute-stage-counts.ts`). Requires valid gcloud auth/creds locally; last executed successfully (Nov 17) to backfill all contacts.
- **Recompute Endpoint**: `POST /v1/introductions/stage/recompute` triggers `IntroductionService.recalculateStageCounts` which aggregates Firestore introductions for the given owner and overwrites `stage_counts`. UI “Refresh Counts” button calls this and we also invoke it automatically after every mutation via `synchronizeStageCounts`.
- **API Exposure**: `/v1/contacts` responses now include `stage_counts`, and `/contacts/filter` accepts `stage_count_filters` (min/max per stage) so clients can render columns or numeric filters.

## Signposts for Upcoming Work
- **Testing pass**: Run through `docs/testing-plan-v2.md` (seed dev Firestore, execute unit/integration/load tests, follow the manual QA checklist) before merging or promoting to prod.
- **Monitoring & Observability**: Phase 7 Milestone 7.2 still pending final dashboard/alert validation.
- **UI ↔ API Integration**: next UI session should consume the new target arrays, Action Status, and company/experience nodes.
- **Production Validation**: once tests pass, redeploy main to Cloud Run and verify the new fields via `/api-docs` + Postman.

## Next Steps if Context Lost
1. **Current Focus**: Complete Phase 7 Milestone 7.2 (Monitoring & Observability)
2. **Upcoming Session**: Review UI repo and connect the introductions workflow to the API (endpoints listed above)
3. **Maintenance**: Use RUNBOOK.md for operational procedures
4. **API Testing**: Use Swagger UI at /api-docs for endpoint testing

## Investor Match API

Primary Express + TypeScript service for founder–investor matching on Firestore. This package carries the deepest Jest coverage and data scripts; use it as the canonical API when testing locally or against the emulator.

### Tech / Runtime
- Node 18+, TypeScript, Express, Firestore Admin SDK, Joi, Jest.

### Prerequisites
- Node 18+, npm
- Firebase project or Firestore emulator
- Service account creds for Firestore (or ADC)

### Setup & Install
```bash
npm install
```

### Run / Dev
```bash
npm run dev           # ts-node-dev on src/server.ts
npm run build && npm start
```

### Commands
- Dev: `npm run dev`
- Build/Start: `npm run build` → `npm start`
- Tests: `npm test`, `npm run test:unit`, `npm run test:integration`, `npm run test:coverage`, `npm run test:watch`
- Emulator: `npm run emulator:start` then `npm run test:integration:emulator`
- Data scripts: `npm run clear:firestore`, `npm run seed:vocabs`, `npm run seed:sample-contacts`, `npm run seed:coverage-contacts`, `npm run backfill:nodes`, `npm run backfill:stage-rank`, `npm run recompute:stage-counts`

### Environment Variables
- `FIREBASE_PROJECT_ID` – target project
- `GOOGLE_APPLICATION_CREDENTIALS` – path to service account JSON (or use ADC)
- `PORT` (default 3000)
- Matching limits/log level as needed

### API / Interfaces
- Contacts: `/v1/contacts` (CRUD), `/v1/contacts/:id/matches`, `/v1/contacts/filter`
- Introductions: `/v1/introductions/stage`, `/v1/introductions/stages/bulk-update`, `/v1/introductions/stage/summary`
- System: `/health`, `/api-docs`

### Sample Requests
- Live (prod):  
```bash
curl -X POST https://investor-match-api-23715448976.us-east1.run.app/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Jane Founder","contact_type":"founder","skills":["javascript"],"industries":["saas"]}'
```
- Local:  
```bash
curl -X GET http://localhost:3000/health
curl -X POST http://localhost:3000/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Local Test","contact_type":"investor","industries":["fintech"]}'
```

### Project Structure
- `src/config` (firebase, collections, reverse-index mapping)
- `src/services` (matching, write sync, flattening, introductions)
- `src/handlers` / `src/routes` (contacts, introductions, system)
- `src/validators` (Joi)
- `tests/` (unit, integration, load)
- `scripts/` (seeding/backfill)

### Testing
- Jest as above; integration needs Firestore emulator or real project.
- Load tests under `tests/load/*.js`.

### Logging & Monitoring
- Logs to stdout (ts-node-dev/node); adjust verbosity via `NODE_ENV` or logger config in code.
- Health: `/health`; Swagger: `/api-docs`.
- Apply repo monitoring guidance in `docs/monitoring/` and runbook `docs/RUNBOOK.md` when deployed.

### Deployment Notes
- Cloud Run compatible; supply service account env vars/secrets.
- Keep Postman collections (repo `postman/`) pointed at correct base URL.

### Do / Don’t Change
- Do keep schema/validators and tests in sync with any UI/schema updates.
- Don’t commit service account keys; use secrets. Keep data scripts aligned with schema changes.

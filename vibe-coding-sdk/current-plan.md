# Investor Match Backend — Current Plan (Template-Aligned)

## Plan Summary
Clean Firestore contacts DB for E2E prompt-engineering and production launch: back up current data, delete all non-coverage documents, retain/seed tagged coverage docs so every collection remains visible in Firestore and filterable in prod UI.

## Plan Architecture (Flow)
1) Inventory Firestore collections and counts (coverage vs non-coverage, where coverage is in the doc ID/name).  
2) Backup: `gcloud auth application-default login` → `gcloud firestore export` to a new GCS prefix in the same project.  
3) Cleanup scripts (Node under `services/investor-match-api`): delete non-coverage docs; ensure/create at least one coverage doc per collection; tag coverage docs with `tag: "coverage"` and allow tagging “test” docs with `tag: "test"` for future UI filtering.  
4) Verification: recount per collection and spot-check console/UI to confirm only coverage-tagged data remains and schema stays visible.

## Plan Structure (Directories & Files)
- Scripts under `services/investor-match-api/scripts/`:
  - `firestore-inventory-coverage.ts` (list counts of coverage vs non-coverage per collection).  
  - `firestore-backup.ts` (wrapper to invoke/export via `gcloud firestore export`).  
  - `firestore-clean-non-coverage.ts` (delete non-coverage docs across target collections).  
  - `firestore-ensure-coverage.ts` (ensure at least one coverage doc per collection, set `tag: "coverage"`, reuse/extend coverage seeds).  
- Uses existing `.env` for Firestore creds/project; runs locally after `gcloud auth application-default login`.

## Modifications (phased, with file targets)
### Phase 1 – Inventory
- Implement `firestore-inventory-coverage.ts` to log per-collection totals and highlight collections missing coverage docs.

### Phase 2 – Backup
- Run `gcloud auth application-default login` (password provided) and execute `gcloud firestore export gs://<project-id>-firestore-backups/firestore-backup-YYYYMMDD-HHMM/`.  
- Confirm export finishes before any deletions.

### Phase 3 – Cleanup
- `firestore-tag-tests.ts`: provide a way to mark certain docs with `tag: "test"` when preparing specific test runs, ensuring future UI filters can exclude them.  
- Collections in scope (from `src/config/firestore-collections.ts`): `contacts`, `introductions`, `jobToBeDone`, `skills`, `industries`, `verticals`, `productTypes`, `raisedCapitalRanges`, `fundingStages`, `companyHeadcountRanges`, `engineeringHeadcountRanges`, `targetDomains`, `roles`, `distributionCapabilities`, `distributionQualityBuckets`, `targetCriteria`, `companies`, `experiences`.  
- Exclusions: system/diagnostic collections (e.g., `__*`, `test`), and any non-contacts config/prompt collections (none identified).

### Phase 4 – Verification
- Rerun inventory/count script; ensure each collection has only coverage-tagged docs and at least one doc to keep the graph visible.  
- Spot-check Firestore console/production UI filter behavior.

## Testing Phase (per change set)
- Dry-run inventory outputs (counts) before and after cleanup.  
- No automated tests; rely on script logs and Firestore console verification.  
- If needed, run `npm run seed:coverage-contacts` after cleanup to repopulate canonical coverage docs.

## Update READMEs (per service)
- Add brief instructions to `services/investor-match-api/Readme.md` (or scripts/README) describing backup → cleanup → ensure coverage workflow and the `tag: "coverage"` convention.

## Specification of what should not be modified (for this plan)
- Do not touch Supabase.  
- Do not delete coverage docs; always retain/create at least one coverage doc per collection.  
- Do not change Firestore security rules or indexes.

## Ready-to-use snippets (copy/paste)
- Auth and backup:
```bash
gcloud auth application-default login
gcloud firestore export gs://<project-id>-firestore-backups/firestore-backup-YYYYMMDD-HHMM/
```
- Run cleanup scripts (inside `services/investor-match-api`):
```bash
npm run ts-node scripts/firestore-inventory-coverage.ts
npm run ts-node scripts/firestore-clean-non-coverage.ts
npm run ts-node scripts/firestore-ensure-coverage.ts
```
- Optional reseed:
```bash
npm run seed:coverage-contacts
```

## UI Agent Instructions
- When you hand off to the UI session, explain the new `tag: "coverage"` and `tag: "test"` conventions so the filter can exclude those datasets.  
- Provide the list of collections in scope (contacts + reverse-index collections) and remind them that each must retain at least one coverage doc so the graph stays visible.  
- Mention the `firestore-tag-tests.ts` helper (via `npm run firestore:tag-tests`) for marking future test documents, so the filter has a predictable tag to target.  

## Current Priorities
1) Implement inventory + backup + cleanup + coverage-ensure scripts under `services/investor-match-api`.  
2) Execute backup, then cleanup, then ensure coverage docs and tagging.  
3) Verify collections/UI after cleanup and document the workflow.

## Status
- Inventory in progress; scripts and backup not yet executed.

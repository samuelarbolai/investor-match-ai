# Monitoring & Observability

This service emits structured metrics/logs that can be ingested by Cloud Logging/Monitoring. The Phase 7 Milestone 7.2 items are covered by:

## Structured Logging
- Every introduction change logs a JSON payload (e.g., `[Introductions] created stage { ownerId, targetId, stage }`) that can be filtered in Cloud Logging with:
  ```
  resource.type="cloud_run_revision"
  jsonPayload.message="[Introductions]"
  ```
- Use the saved query `introductions-stage-changes` (see `docs/monitoring/logging-queries.md`) to build dashboards on top of log-based metrics.

## Custom Metrics
- Instrumented metrics are emitted via `src/observability/metrics.service.ts` in the format `[Metric] <name> { type, value, labels }`. Log-based metrics (LBMs) can be created for:
  | Metric Name                               | Description | Suggested LBM |
  |-------------------------------------------|-------------|---------------|
  | `introductions.stage_change`              | Count of single stage changes | Counter on `jsonPayload.name="introductions.stage_change"` |
  | `introductions.stage_change_error`        | Failed single stage operations | Counter |
  | `introductions.set_stage.duration`        | Latency (ms) for `setStage` | Distribution |
  | `introductions.bulk_set_stage`            | Bulk updates processed | Counter |
  | `introductions.bulk_set_stage_error`      | Bulk failures | Counter |
  | `introductions.stage_count.updated`       | Number of per-contact stage count adjustments | Counter |
  | `introductions.stage_count.update_error`  | Failures updating cached counts | Counter |

## Dashboards
- Import `docs/monitoring/dashboard.introductions.json` into Cloud Monitoring to get:
  - Stage change rate (success vs failures)
  - Average latency for single/bulk operations
  - Stage-count update throughput
  - Alerts summary panel (hooked to the policies below)
- Import `docs/monitoring/dashboard.api-overview.json` for global API latency/error/throughput/slow-request panels (based on the `api.request.*` metrics emitted in the logging middleware).

### Import Instructions
1. Open Google Cloud Console → **Monitoring** → **Dashboards**.
2. Click **Create dashboard** → **Import** and upload the desired JSON file (introductions or API overview).
3. Save the dashboard and optionally pin widgets to existing views.
4. CLI option: `gcloud monitoring dashboards create --config-from-file=docs/monitoring/<file>.json`.

## Alert Policies
- See `docs/monitoring/alert-policies.md` for ready-to-use `gcloud monitoring policies create` snippets:
  1. **Stage Change Error Rate** – triggers if `introductions.stage_change_error` > 5 within 5m.
  2. **Bulk Failure Alert** – triggers on any `introductions.bulk_set_stage_error`.
  3. **Stage Count Drift** – triggers if `introductions.stage_count.update_error` ≥ 1 in 10m (ensures cached counts stay healthy).

## Usage
1. Enable log-based metrics for each `[Metric]` log (instructions in `logging-queries.md`).
2. Import the dashboard JSON via the Cloud Monitoring UI.
3. Apply the alert policies file or run the `gcloud` commands referenced in `alert-policies.md`.

With these steps the monitoring milestone (dashboards, alerts, custom metrics, structured logging) is satisfied, and operations teams can observe introductions throughput/latency without code changes.

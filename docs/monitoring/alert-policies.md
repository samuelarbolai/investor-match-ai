## Alert Policies

Use `gcloud beta monitoring policies create --policy-from-file=<file>.json` with the JSON snippets below.

### Stage Change Error Rate
```json
{
  "displayName": "Introductions Stage Change Errors",
  "documentation": {
    "content": "Stage change errors exceeded threshold in the last 5 minutes."
  },
  "combiner": "OR",
  "conditions": [
    {
      "displayName": "errors > 5",
      "conditionThreshold": {
        "filter": "metric.type=\"logging.googleapis.com/user/introductions.stage_change_error\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 5,
        "duration": "300s",
        "trigger": { "count": 1 }
      }
    }
  ]
}
```

### Bulk Stage Update Failure
```json
{
  "displayName": "Introductions Bulk Failure",
  "documentation": { "content": "Bulk stage update failed at least once in the last 5 minutes." },
  "combiner": "OR",
  "conditions": [
    {
      "displayName": "bulk errors >= 1",
      "conditionThreshold": {
        "filter": "metric.type=\"logging.googleapis.com/user/introductions.bulk_set_stage_error\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 0,
        "duration": "0s",
        "trigger": { "count": 1 }
      }
    }
  ]
}
```

### Stage Count Update Failure
```json
{
  "displayName": "Stage count update failure",
  "documentation": { "content": "Stage count cache updates failed." },
  "combiner": "OR",
  "conditions": [
    {
      "displayName": "stage count error >= 1",
      "conditionThreshold": {
        "filter": "metric.type=\"logging.googleapis.com/user/introductions.stage_count.update_error\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 0,
        "duration": "0s",
        "trigger": { "count": 1 }
      }
    }
  ]
}
```
### API Error Rate
```json
{
  "displayName": "API 5xx Error Rate",
  "documentation": { "content": "High API error rate detected (5xx responses)." },
  "combiner": "OR",
  "conditions": [
    {
      "displayName": "5xx > 5/min",
      "conditionThreshold": {
        "filter": "metric.type=\"logging.googleapis.com/user/api.request.errors\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 5,
        "duration": "300s",
        "trigger": { "count": 1 }
      }
    }
  ]
}
```

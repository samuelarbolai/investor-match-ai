## Saved Logging Queries

### 1. Introductions Stage Changes
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="introductions.stage_change"
```

### 2. Stage Change Errors
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="introductions.stage_change_error"
```

### 3. Bulk Stage Updates
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="introductions.bulk_set_stage"
```

### 4. Stage Count Delta Failures
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="introductions.stage_count.update_error"
```

Save each query in Cloud Logging; they back the dashboards/alerts and allow ad-hoc debugging.
### 5. API Request Count
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="api.request.count"
```

### 6. API Request Errors (5xx)
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="api.request.errors"
```

### 7. API Request Duration
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="api.request.duration"
```

### 8. Slow Requests (>1s)
```
resource.type="cloud_run_revision"
jsonPayload.message="[Metric]"
jsonPayload.name="api.request.slow"
```

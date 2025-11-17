# Investor Match API - Operations Runbook

## 📋 Table of Contents

- [Service Overview](#service-overview)
- [Monitoring & Alerts](#monitoring--alerts)
- [Common Issues & Solutions](#common-issues--solutions)
- [Deployment Procedures](#deployment-procedures)
- [Database Operations](#database-operations)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Emergency Procedures](#emergency-procedures)

## 🚀 Service Overview

### Production Environment
- **Service Name:** investor-match-api
- **Platform:** Google Cloud Run
- **Region:** us-east1
- **URL:** https://investor-match-api-23715448976.us-east1.run.app
- **Database:** Cloud Firestore (investor-match-ai project)
- **Repository:** https://github.com/samuelarbolai/investor-match-ai

### Key Metrics
- **Target Response Time:** <2s (95th percentile)
- **Target Uptime:** 99.9%
- **Target Error Rate:** <1%
- **Current Scale:** 2K+ contacts supported

## 📊 Monitoring & Alerts

### Health Check Endpoints
```bash
# Service health
curl https://investor-match-api-23715448976.us-east1.run.app/health

# Expected response:
{
  "service": "investor-match-api",
  "status": "OK",
  "timestamp": "2025-11-14T20:00:00Z"
}
```

### Key Metrics to Monitor

#### 1. Response Time Metrics
```bash
# View Cloud Run metrics
gcloud logging read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api" \
  --limit=50
```

#### 2. Error Rate Monitoring
- **4xx errors:** Client validation issues
- **5xx errors:** Server/database issues
- **Timeout errors:** Firestore connection issues

#### 3. Database Performance
- **Firestore read operations:** Should be <51 reads per match query
- **Firestore write operations:** Should be <11 writes per contact creation
- **Connection errors:** Firebase authentication issues

### Recommended Alerts

#### Critical Alerts (Immediate Response)
1. **Service Down:** Health check fails for >2 minutes
2. **High Error Rate:** >5% error rate for >5 minutes
3. **Database Unavailable:** Firestore connection failures

#### Warning Alerts (Monitor Closely)
1. **Slow Response Time:** >3s response time for >10 minutes
2. **High Memory Usage:** >80% memory utilization
3. **Unusual Traffic:** >10x normal request volume

## 🔧 Common Issues & Solutions

### Issue 1: Service Not Responding

**Symptoms:**
- Health check endpoint returns 503 or times out
- All API endpoints unresponsive

**Diagnosis:**
```bash
# Check Cloud Run service status
gcloud run services describe investor-match-api --region=us-east1

# Check recent logs
gcloud logs read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api" \
  --limit=20
```

**Solutions:**
1. **Restart Service:**
   ```bash
   gcloud run services update investor-match-api \
     --region=us-east1 \
     --update-env-vars=RESTART_TIMESTAMP=$(date +%s)
   ```

2. **Redeploy Latest Version:**
   ```bash
   cd services/investor-match-api
   gcloud run deploy investor-match-api \
     --source . \
     --region=us-east1
   ```

### Issue 2: High Response Times

**Symptoms:**
- API responses taking >5 seconds
- Timeout errors in logs

**Diagnosis:**
```bash
# Check for slow Firestore queries
gcloud logs read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api AND textPayload:\"slow\"" \
  --limit=10
```

**Solutions:**
1. **Check Firestore Performance:**
   - Review query patterns in matching algorithm
   - Ensure reverse indexes are properly maintained
   - Consider adding composite indexes for complex queries

2. **Scale Up Resources:**
   ```bash
   gcloud run services update investor-match-api \
     --region=us-east1 \
     --memory=1Gi \
     --cpu=2
   ```

### Issue 3: Firebase Authentication Errors

**Symptoms:**
- "invalid_grant" or "reauth related error" in logs
- Firestore operations failing

**Diagnosis:**
```bash
# Check service account permissions
gcloud projects get-iam-policy investor-match-ai \
  --flatten="bindings[].members" \
  --filter="bindings.members:*compute@developer.gserviceaccount.com"
```

**Solutions:**
1. **Regenerate Service Account Key:**
   ```bash
   gcloud iam service-accounts keys create new-key.json \
     --iam-account=23715448976-compute@developer.gserviceaccount.com
   ```

2. **Update Cloud Run Environment:**
   ```bash
   gcloud run services update investor-match-api \
     --region=us-east1 \
     --update-env-vars=FIREBASE_PROJECT_ID=investor-match-ai
   ```

### Issue 4: Memory Leaks or High Memory Usage

**Symptoms:**
- Service restarts frequently
- Out of memory errors in logs

**Diagnosis:**
```bash
# Monitor memory usage
gcloud monitoring metrics list \
  --filter="resource.type=cloud_run_revision"
```

**Solutions:**
1. **Increase Memory Allocation:**
   ```bash
   gcloud run services update investor-match-api \
     --region=us-east1 \
     --memory=2Gi
   ```

2. **Review Code for Memory Leaks:**
   - Check for unclosed Firestore connections
   - Review large object allocations in matching algorithm
   - Ensure proper cleanup in request handlers

## 🚀 Deployment Procedures

### Automated Deployment (Recommended)
1. **Create Pull Request:**
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   git commit -m "Your changes"
   git push origin feature/your-feature
   ```

2. **Merge to Main:**
   - GitHub Actions automatically runs tests
   - On successful merge, deploys to production

### Manual Deployment (Emergency)
```bash
cd services/investor-match-api

# Deploy directly
gcloud run deploy investor-match-api \
  --source . \
  --region=us-east1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=investor-match-ai
```

### Rollback Procedure
```bash
# List recent revisions
gcloud run revisions list --service=investor-match-api --region=us-east1

# Rollback to previous revision
gcloud run services update-traffic investor-match-api \
  --region=us-east1 \
  --to-revisions=REVISION_NAME=100
```

## 💾 Database Operations

### Backup Procedures
Firestore automatically handles backups, but for critical operations:

```bash
# Export Firestore data
gcloud firestore export gs://investor-match-ai-backups/$(date +%Y%m%d) \
  --project=investor-match-ai
```

### Data Consistency Checks
```bash
# Run data consistency script
cd services/investor-match-api
npm run check-data-consistency
```

### Reverse Index Maintenance
If reverse indexes become inconsistent:

```bash
# Rebuild reverse indexes (use with caution)
cd services/investor-match-api
npm run rebuild-reverse-indexes
```

### Introduction Pipeline Operations
- **Collection:** `introductions`
- **Document ID format:** `{ownerId}__{targetId}` (ensures one record per pipeline owner/target pair)
- **Stages:** `prospect`, `lead`, `to-meet`, `met`, `not-in-campaign`, `disqualified`

#### Create or Update a Stage Manually
```bash
gcloud firestore documents create "introductions/OWNER__TARGET" \
  --document='{"ownerId":"OWNER","targetId":"TARGET","stage":"lead","createdAt":'"'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'"'"}'

# or update existing stage
gcloud firestore documents update "introductions/OWNER__TARGET" \
  stage=met \
  updatedAt="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
```

#### Required Composite Indexes
1. `ownerId ASC, stage ASC` – needed for `/v1/introductions/stage?stage=...`
2. `ownerId ASC, targetId ASC` – improves analytics/deduplication queries

Create via CLI (must run from a machine with gcloud configured):
```bash
gcloud firestore indexes composite create \
  --collection-group=introductions \
  --field-config field-path=ownerId,order=ASC \
  --field-config field-path=stage,order=ASC
```

Firestore will emit an error with a direct console link if additional indexes are required.

## ⚡ Performance Optimization

### Monitoring Performance
```bash
# Check average response times
gcloud logs read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api AND textPayload:\"Response time\"" \
  --limit=50
```

### Optimization Strategies

#### 1. Database Optimization
- **Batch Operations:** Group Firestore writes when possible
- **Index Optimization:** Add composite indexes for complex queries
- **Connection Pooling:** Reuse Firestore connections

#### 2. Application Optimization
- **Caching:** Implement in-memory caching for frequently accessed data
- **Pagination:** Add pagination for large result sets
- **Async Processing:** Use background jobs for heavy operations

#### 3. Infrastructure Optimization
- **Auto-scaling:** Configure Cloud Run min/max instances
- **Resource Allocation:** Adjust CPU/memory based on usage patterns
- **CDN:** Add Cloud CDN for static content

## 🔒 Security Considerations

### Access Control
- Service uses default Compute Engine service account
- Firestore security rules restrict access to authenticated requests
- Cloud Run allows unauthenticated requests (API is public)

### Security Monitoring
```bash
# Monitor for unusual access patterns
gcloud logs read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api AND severity>=WARNING" \
  --limit=20
```

### Security Best Practices
1. **Regular Updates:** Keep dependencies updated
2. **Input Validation:** All inputs validated with Joi schemas
3. **Error Handling:** No sensitive data in error responses
4. **Logging:** Structured logging without PII

## 🚨 Emergency Procedures

### Service Outage Response

#### Step 1: Assess Impact
```bash
# Check service status
curl -I https://investor-match-api-23715448976.us-east1.run.app/health

# Check error rates
gcloud logs read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api AND severity>=ERROR" \
  --limit=10
```

#### Step 2: Immediate Actions
1. **Scale Up Resources:**
   ```bash
   gcloud run services update investor-match-api \
     --region=us-east1 \
     --min-instances=2 \
     --max-instances=10
   ```

2. **Enable Traffic Splitting (if needed):**
   ```bash
   # Deploy to new revision with traffic split
   gcloud run deploy investor-match-api-emergency \
     --source . \
     --region=us-east1 \
     --no-traffic
   
   # Gradually shift traffic
   gcloud run services update-traffic investor-match-api \
     --region=us-east1 \
     --to-revisions=investor-match-api-emergency=50,LATEST=50
   ```

#### Step 3: Communication
1. Update status page (if available)
2. Notify stakeholders via established channels
3. Document incident for post-mortem

### Data Corruption Response

#### Step 1: Stop Writes
```bash
# Deploy maintenance mode
gcloud run services update investor-match-api \
  --region=us-east1 \
  --update-env-vars=MAINTENANCE_MODE=true
```

#### Step 2: Assess Damage
```bash
# Run data integrity checks
cd services/investor-match-api
npm run check-data-integrity
```

#### Step 3: Restore from Backup
```bash
# Import from backup
gcloud firestore import gs://investor-match-ai-backups/BACKUP_DATE \
  --project=investor-match-ai
```

## 📞 Escalation Contacts

### Primary Contacts
- **Development Team:** [Your team contact]
- **DevOps/SRE:** [Your DevOps contact]
- **Product Owner:** [Product owner contact]

### External Contacts
- **Google Cloud Support:** [Your support plan details]
- **Firebase Support:** [Firebase support channel]

## 📚 Additional Resources

### Documentation
- [API Documentation](https://investor-match-api-23715448976.us-east1.run.app/api-docs)
- [Architecture Diagram](./architecture-diagram.html)
- [GitHub Repository](https://github.com/samuelarbolai/investor-match-ai)

### Monitoring Dashboards
- [Cloud Run Console](https://console.cloud.google.com/run)
- [Firestore Console](https://console.firebase.google.com)
- [Cloud Logging](https://console.cloud.google.com/logs)

### Useful Commands Reference
```bash
# Quick health check
curl https://investor-match-api-23715448976.us-east1.run.app/health

# View recent logs
gcloud logs tail "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=investor-match-api"

# Deploy new version
cd services/investor-match-api && gcloud run deploy investor-match-api \
  --source . --region=us-east1

# Scale service
gcloud run services update investor-match-api \
  --region=us-east1 --min-instances=1 --max-instances=5

# Check service status
gcloud run services describe investor-match-api --region=us-east1
```

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Maintained by:** Development Team

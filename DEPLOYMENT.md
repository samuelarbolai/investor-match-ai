# Deployment Guide - Microservices Architecture

## Overview
This project uses a serverless microservices architecture where each service is deployed as a separate Cloud Run instance.

## Services

| Service | Cloud Run Name | Purpose |
|---------|----------------|---------|
| contact-service | investor-match-ai-contact-service | Contact CRUD operations |
| matching-service | investor-match-ai-matching-service | Matching algorithm |
| flattening-service | investor-match-ai-flattening-service | Contact flattening logic |
| reverse-index-service | investor-match-ai-reverse-index-service | Reverse index updates |
| validation-service | investor-match-ai-validation-service | Request validation |

## Deployment Commands

Deploy each service individually using these commands:

### Contact Service
```bash
gcloud run deploy investor-match-ai-contact-service \
  --source ./services/contact-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Matching Service
```bash
gcloud run deploy investor-match-ai-matching-service \
  --source ./services/matching-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Flattening Service
```bash
gcloud run deploy investor-match-ai-flattening-service \
  --source ./services/flattening-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Reverse Index Service
```bash
gcloud run deploy investor-match-ai-reverse-index-service \
  --source ./services/reverse-index-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Validation Service
```bash
gcloud run deploy investor-match-ai-validation-service \
  --source ./services/validation-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Service Communication

Services communicate via HTTP calls using environment variables for service discovery:

```bash
# Set these environment variables for each service
CONTACT_SERVICE_URL=https://investor-match-ai-contact-service-xxx.run.app
MATCHING_SERVICE_URL=https://investor-match-ai-matching-service-xxx.run.app
FLATTENING_SERVICE_URL=https://investor-match-ai-flattening-service-xxx.run.app
REVERSE_INDEX_SERVICE_URL=https://investor-match-ai-reverse-index-service-xxx.run.app
VALIDATION_SERVICE_URL=https://investor-match-ai-validation-service-xxx.run.app
```

## Health Checks

Each service exposes a health check endpoint:
- `GET /health` - Returns service status and timestamp

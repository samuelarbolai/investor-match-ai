# Founder-Investor Matching System
## Implementation Plan - Serverless Microservices Architecture

---

## Executive Summary

**Project:** Graph-based founder-investor matching system using Firestore as a cost-optimized graph database  
**Architecture:** Serverless microservices on Google Cloud Run  
**Tech Stack:** Node.js/Express, Firestore, Cloud Run  
**Initial Scale:** 2,000 contacts  
**Timeline:** 6-8 weeks (phased delivery)

---

## Phase 6: Deployment (Week 7)

### Milestone 6.1: Containerization
**Goal:** Build production-ready Docker image

**Tasks:**
- [ ] Create Dockerfile with multi-stage build
- [ ] Optimize image size
- [ ] Add health check endpoint (`/health`)
- [ ] Configure environment variables
- [ ] Test local Docker build

**Deliverables:**
- `Dockerfile`
- `.dockerignore`
- Health check endpoint

**Testing:**
- Build image locally: `docker build -t founder-investor-api .`
- Run container: `docker run -p 8080:8080 founder-investor-api`
- Hit health endpoint

---

### Milestone 6.2: Cloud Run Deployment
**Goal:** Deploy to GCP Cloud Run

**Tasks:**
- [ ] Set up GCP project
- [ ] Enable Cloud Run API
- [ ] Configure service account with Firestore access
- [ ] Build and push image to Artifact Registry
- [ ] Deploy to Cloud Run
- [ ] Configure environment variables
- [ ] Set up Cloud Run invoker permissions (public for now)
- [ ] Configure memory and CPU limits

**Deliverables:**
- Deployed Cloud Run service
- Public API endpoint URL

**Testing:**
- Test all API endpoints on production URL
- Monitor Cloud Run logs
- Verify Firestore reads/writes

---

### Milestone 6.3: CI/CD Pipeline
**Goal:** Automate testing and deployment

**Tasks:**
- [ ] Set up GitHub Actions (or Cloud Build)
- [ ] Create workflow for running tests on PR
- [ ] Create workflow for building Docker image
- [ ] Create workflow for deploying to Cloud Run on main branch
- [ ] Add status badges to README

**Deliverables:**
- `.github/workflows/*.yml`
- Automated deployment on merge to main

**Testing:**
- Create test PR and verify tests run
- Merge to main and verify auto-deploy

---
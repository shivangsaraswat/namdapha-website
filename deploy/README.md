# Project S Deployment Guide

## Architecture Overview
```
Frontend (Vercel)     →  api.yoursite.com (Railway)
Admin (Vercel)        →  api.yoursite.com (Railway)
```

## Deployment Structure
- **Frontend**: `frontend/` → Vercel
- **Admin Dashboard**: `backend/admin-dashboard/` → Vercel  
- **API Server**: `backend/api/` → Railway

## Quick Deploy Commands
```bash
# Deploy Frontend
./deploy/scripts/deploy-frontend.sh

# Deploy Admin Dashboard  
./deploy/scripts/deploy-admin.sh

# Deploy API Server
./deploy/scripts/deploy-api.sh
```

## Environment Variables Required
- See individual `.env.example` files in each service
- Configure in respective platforms (Vercel/Railway)
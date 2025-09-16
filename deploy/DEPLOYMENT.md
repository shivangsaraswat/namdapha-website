# Complete Deployment Guide

## 🏗️ Architecture
```
yoursite.com (Frontend - Vercel)
admin.yoursite.com (Admin - Vercel)  
api.yoursite.com (API - Railway)
```

## 📋 Pre-Deployment Checklist

### 1. Frontend Deployment (Vercel)
```bash
cd frontend
vercel --prod
```
- **Domain**: `yoursite.com`
- **Environment**: Set `NEXT_PUBLIC_API_URL`

### 2. Admin Dashboard Deployment (Vercel)
```bash
cd backend/admin-dashboard
vercel --prod
```
- **Domain**: `admin.yoursite.com`
- **Environment**: Set `NEXT_PUBLIC_API_URL`

### 3. API Server Deployment (Railway)
```bash
railway login
railway up
```
- **Domain**: Auto-generated or custom
- **Environment**: Set `PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`

## 🚀 One-Click Deploy
```bash
# Deploy all services
./deploy/scripts/deploy-frontend.sh
./deploy/scripts/deploy-admin.sh
./deploy/scripts/deploy-api.sh
```

## 🔧 Environment Setup

### Vercel (Frontend & Admin)
1. Go to project settings
2. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-api.railway.app`

### Railway (API)
1. Go to project variables
2. Add:
   - `PORT=3001`
   - `NODE_ENV=production`
   - `DATABASE_URL=your_db_url`
   - `JWT_SECRET=your_secret`

## 🌐 Custom Domains
- Frontend: Connect `yoursite.com` in Vercel
- Admin: Connect `admin.yoursite.com` in Vercel  
- API: Connect `api.yoursite.com` in Railway

## 📊 Monitoring
- Vercel: Built-in analytics
- Railway: Built-in metrics
- Add error tracking (Sentry) if needed
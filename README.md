# Namdapha Website

A full-stack web application with separate frontend, admin dashboard, and API server.

## 🏗️ Architecture

### Firebase (Recommended)
```
Frontend (Next.js) + API (Functions) → Firebase
Admin Dashboard (Next.js) → Vercel
```

### Multi-Platform (Alternative)
```
Frontend (Next.js) → Vercel
Admin Dashboard (Next.js) → Vercel
API Server (Express.js) → Railway
```

## 📁 Project Structure

```
namdapha-website/
├── frontend/              # Next.js client application
├── backend/
│   ├── api/              # Express.js API server (legacy)
│   ├── admin-dashboard/  # Next.js admin dashboard
│   └── shared/           # Shared utilities
└── deploy/               # Deployment configurations
    ├── firebase/         # Firebase config & functions
    ├── vercel/          # Vercel configurations
    ├── railway/         # Railway configurations
    └── scripts/         # Deployment scripts
```

## 🚀 Quick Start

### Firebase (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start local development
cd deploy/firebase
firebase emulators:start

# In another terminal
cd frontend
npm install && npm run dev
```

### Legacy Development
```bash
# Frontend
cd frontend && npm install && npm run dev

# API Server
cd backend/api && npm install && npm run dev

# Admin Dashboard
cd backend/admin-dashboard && yarn install && yarn dev
```

## 🌐 Deployment

See [DEPLOYMENT.md](deploy/DEPLOYMENT.md) for complete deployment guide.

### Firebase (Recommended)
```bash
./deploy/scripts/deploy-firebase.sh
```

### Multi-Platform
- **Frontend**: Vercel
- **Admin Dashboard**: Vercel
- **API Server**: Railway

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions, Firestore Database
- **Admin**: Next.js 15, TypeScript, Tailwind CSS
- **Deployment**: Firebase, Vercel (alternative: Railway, Docker)

## 📋 Key Features

- ✅ **$0/month** hosting with Firebase
- ✅ **Real-time database** with Firestore
- ✅ **Auto-scaling** serverless functions
- ✅ **Global CDN** for fast loading
- ✅ **Branched development** workflow
# Namdapha Website

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

### Firebase
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

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions, Firestore Database
- **Admin**: Next.js 15, TypeScript, Tailwind CSS
- **Deployment**: Firebase, Vercel (alternative: Railway, Docker)

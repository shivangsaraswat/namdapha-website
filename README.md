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

### Development
```bash
# Frontend (deployed to Vercel)
cd frontend && npm install && npm run dev

# Admin Dashboard (deployed to Firebase)
cd backend/admin-dashboard && yarn install && yarn dev

# Firebase Functions (backend)
cd deploy/firebase && firebase emulators:start
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Firebase Functions, Firestore Database
- **Admin**: Next.js 15, TypeScript, Tailwind CSS
- **Deployment**: 
  - Frontend: Vercel
  - Admin Dashboard: Firebase Hosting
  - Backend: Firebase Functions

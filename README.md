# Project S

A full-stack web application with separate frontend, admin dashboard, and API server.

## 🏗️ Architecture

```
Frontend (Next.js)     →  API Server (Express.js)
Admin Dashboard (Next.js) →  API Server (Express.js)
```

## 📁 Project Structure

```
project-s/
├── frontend/              # Next.js client application
├── backend/
│   ├── api/              # Express.js API server
│   ├── admin-dashboard/  # Next.js admin dashboard
│   └── shared/           # Shared utilities
└── deploy/               # Deployment configurations
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### API Server
```bash
cd backend/api
npm install
npm run dev
```

### Admin Dashboard
```bash
cd backend/admin-dashboard
yarn install
yarn dev
```

## 🌐 Deployment

See [DEPLOYMENT.md](deploy/DEPLOYMENT.md) for complete deployment guide.

- **Frontend**: Vercel
- **Admin Dashboard**: Vercel
- **API Server**: Railway

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Admin**: Next.js 15, TypeScript, Tailwind CSS
- **Deployment**: Vercel, Railway, Docker
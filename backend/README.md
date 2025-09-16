# Project S Backend

## Structure

- `api/` - Express.js API server
- `admin-dashboard/` - Next.js 15 admin dashboard (initialize with `npx create-next-app@latest`)
- `shared/` - Shared utilities and constants
- `docker/` - Deployment configurations

## Getting Started

### API Server
```bash
cd api
npm install
npm run dev
```

### Admin Dashboard
```bash
cd admin-dashboard
# Initialize Next.js 15 here
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

## Deployment
- API: Railway/Render
- Admin Dashboard: Vercel
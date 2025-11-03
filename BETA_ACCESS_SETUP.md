# Beta Access System - Setup Complete ✅

## Overview
Your website now has a **30-minute beta testing system** with Google OAuth authentication.

## How It Works

### For Beta Testers:
1. Visit website → Redirected to login page
2. Sign in with Google
3. Get **30 minutes** of full access
4. After 30 minutes → Auto logout with "expired" message
5. Cannot login again (must contact admin)

### For Super Admin:
1. Go to **Admin Dashboard** → **Beta Testers** page
2. Add email addresses of testers
3. Monitor their session status
4. Remove testers when needed

## Setup Instructions

### 1. Install Dependencies (Already Done ✅)
```bash
cd frontend
npm install next-auth jose
```

### 2. Environment Variables (Already Done ✅)
Frontend `.env.local` is configured with:
- Google OAuth credentials (same as admin dashboard)
- Firebase credentials
- NextAuth secret

### 3. Start Development Servers

**Admin Dashboard:**
```bash
cd backend/admin-dashboard
npm run dev
# Runs on http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3001
```

### 4. Add Beta Testers

1. Open Admin Dashboard: http://localhost:3000
2. Login as Super Admin
3. Go to **Beta Testers** page (in sidebar)
4. Add email addresses
5. Share website link with testers

## Features Implemented

✅ **Middleware Protection** - All routes protected automatically
✅ **30-Minute Sessions** - Tracked from first login
✅ **Auto Logout** - Expires after 30 minutes
✅ **Google OAuth** - Reuses admin dashboard credentials
✅ **Firebase Storage** - Beta testers stored in Firestore
✅ **Admin Management** - Add/remove testers easily
✅ **Session Monitor** - Checks every minute for expiry
✅ **Expired Message** - Shows custom message after timeout

## Files Created

### Frontend:
- `middleware.ts` - Protects all routes
- `lib/betaAuth.ts` - Beta access logic
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config
- `app/api/beta/check-session/route.ts` - Session checker
- `app/beta-login/page.tsx` - Login page
- `app/beta-access-denied/page.tsx` - Access denied page
- `components/SessionProvider.tsx` - Auth provider
- `components/BetaSessionMonitor.tsx` - Auto logout monitor

### Admin Dashboard:
- `src/app/admin/beta-testers/page.tsx` - Management page

## Firebase Structure

```
betaTesters/
  ├── user1@example.com
  │   ├── addedAt: Timestamp
  │   └── firstLogin: Timestamp (set on first login)
  ├── user2@example.com
  │   ├── addedAt: Timestamp
  │   └── firstLogin: Timestamp
```

## Testing

1. **Add yourself as beta tester** in admin dashboard
2. **Visit frontend** (http://localhost:3001)
3. **Login with Google**
4. **Browse website** - full access for 30 minutes
5. **Wait 30 minutes** OR manually change `firstLogin` in Firestore to test expiry
6. **Try to access** - should auto logout and show expired message

## Production Deployment

### Frontend (Firebase Hosting):
1. Update `.env.local` with production URLs
2. Build: `npm run build`
3. Deploy: `firebase deploy --only hosting`

### Update Google OAuth:
Add production callback URL:
```
https://your-domain.com/api/auth/callback/google
```

## Removing Beta Access (Go Public)

When ready to make website public:

1. **Delete middleware.ts** - Removes protection
2. **Remove SessionProvider** from layout.tsx
3. **Delete beta pages** - beta-login, beta-access-denied
4. **Keep admin dashboard** - For content management

## Support

For issues:
- Check Firebase console for beta testers collection
- Check browser console for auth errors
- Verify Google OAuth credentials
- Ensure both servers are running

---

**Status:** ✅ Ready to use
**Session Duration:** 30 minutes
**Auto Logout:** Yes
**Admin Management:** Yes

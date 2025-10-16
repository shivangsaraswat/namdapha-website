# Fix 404 Dashboard Error on Vercel

## The Problem
After Google sign-in, you're redirected to `/dashboard` which shows a 404 error.

## Root Cause
The `/dashboard` page exists in the code but Vercel build is likely failing due to missing dependencies or build errors.

## Solution: Check Vercel Build Logs

1. Go to: https://vercel.com/shivangsaraswats-projects/namdapha-website-eight/deployments
2. Click on the latest deployment
3. Look for build errors in the logs
4. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

## Quick Fix: Redeploy

1. Go to: https://vercel.com/shivangsaraswats-projects/namdapha-website-eight
2. Click **Deployments** tab
3. Find the latest deployment
4. Click the three dots (•••)
5. Click **Redeploy**
6. **UNCHECK** "Use existing Build Cache"
7. Click **Redeploy**

## Alternative: Change Default Redirect

If dashboard keeps failing, redirect to root page instead:

The auth.ts file has been updated to redirect to `/` (root) instead of `/dashboard`.

To use root page:
- Keep the current auth.ts (already updated)
- Users will land on the main page after sign-in
- They can navigate to dashboard from sidebar

To use dashboard (recommended):
- Fix the build errors on Vercel first
- Dashboard page exists and should work once build succeeds

## Verify Environment Variables

Make sure ALL these are set in Vercel:
```
NEXTAUTH_URL=https://namdapha-website-eight.vercel.app
NEXTAUTH_SECRET=<your-secret>
GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
NEXT_PUBLIC_FIREBASE_API_KEY=<your-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

## Test Locally First

```bash
cd backend/admin-dashboard
npm install
npm run build

# If build succeeds locally, the issue is Vercel-specific
# If build fails, fix the errors shown
```

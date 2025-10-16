# Update Vercel Environment Variables

## The Issue
NEXTAUTH_URL is set to `http://localhost:3000` but needs to be your Vercel URL.

## Fix via Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/shivangsaraswats-projects/namdapha-website-eight/settings/environment-variables
2. Find `NEXTAUTH_URL`
3. Click **Edit**
4. Change value to: `https://namdapha-website-eight.vercel.app`
5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** (with "Use existing Build Cache" unchecked)

## Fix via CLI

```bash
cd backend/admin-dashboard

# Remove old value
vercel env rm NEXTAUTH_URL production

# Add new value
vercel env add NEXTAUTH_URL production
# When prompted, enter: https://namdapha-website-eight.vercel.app

# Redeploy
vercel --prod
```

## Verify All Environment Variables Are Set

Make sure these are in Vercel:
- ✅ NEXTAUTH_URL=https://namdapha-website-eight.vercel.app
- ✅ NEXTAUTH_SECRET=<your-secret>
- ✅ GOOGLE_CLIENT_ID=<your-google-client-id>
- ✅ GOOGLE_CLIENT_SECRET=<your-google-client-secret>
- ✅ All NEXT_PUBLIC_FIREBASE_* variables
- ✅ All Cloudinary variables

## After Update

Wait 30 seconds for deployment, then visit:
https://namdapha-website-eight.vercel.app

Login should work!

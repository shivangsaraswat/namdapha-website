# Deploy Admin Dashboard to Vercel

## Prerequisites
- Vercel account (free): https://vercel.com/signup
- Vercel CLI (optional): `npm i -g vercel`

## Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare admin dashboard for Vercel"
   git push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Set **Root Directory**: `backend/admin-dashboard`
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel Dashboard)
   - Go to Project Settings → Environment Variables
   - Add these variables from your `.env.local`:
     ```
     NEXTAUTH_URL=https://your-admin-domain.vercel.app
     NEXTAUTH_SECRET=your-secret-here
     NEXT_PUBLIC_FIREBASE_API_KEY=your-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
     ```

4. **Redeploy** after adding environment variables

## Method 2: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from admin-dashboard directory**
   ```bash
   cd backend/admin-dashboard
   vercel
   ```

4. **Follow prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: namdapha-admin (or your choice)
   - Directory: ./ (current directory)
   - Override settings: No

5. **Add environment variables**
   ```bash
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   # ... add all other env vars
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Post-Deployment

1. **Update NEXTAUTH_URL**
   - Copy your Vercel URL (e.g., `https://namdapha-admin.vercel.app`)
   - Update `NEXTAUTH_URL` environment variable in Vercel
   - Redeploy

2. **Test Admin Dashboard**
   - Visit your Vercel URL
   - Test login functionality
   - Verify Firebase connection works

## Auto-Deploy Setup

Vercel automatically deploys on every push to your main branch. No additional setup needed!

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `admin.namdapha.com`)
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

**Build fails:**
- Check environment variables are set correctly
- Verify all dependencies in package.json

**Auth not working:**
- Ensure NEXTAUTH_URL matches your Vercel domain
- Check NEXTAUTH_SECRET is set

**Firebase connection fails:**
- Verify all NEXT_PUBLIC_FIREBASE_* variables are set
- Check Firebase project settings

## Notes

- ✅ API routes work perfectly on Vercel
- ✅ NextAuth works out of the box
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free for hobby projects
- ✅ No code changes needed from Firebase hosting attempt

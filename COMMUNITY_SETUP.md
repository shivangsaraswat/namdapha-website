# Community Feature Setup Guide

## ✅ Completed Setup

1. **NextAuth Configuration** - Google OAuth integrated
2. **SessionProvider** - Wrapped in root layout
3. **Redis Client** - Upstash Redis ready
4. **Dependencies** - All packages installed

## 🔧 Required Configuration

### 1. Upstash Redis Setup

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token
4. Add to `frontend/.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 2. Google OAuth Setup (Already Configured)

✅ Credentials from admin dashboard already added:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### 3. Cloudinary Setup (Already Configured)

✅ Credentials from admin dashboard already added:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 4. Update Google OAuth Authorized Domains

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`

## 🚀 Running the Application

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:3001/community`

## 📝 Features Implemented

- ✅ Google OAuth authentication
- ✅ User profile creation
- ✅ Post creation with media upload
- ✅ Like/Unlike posts
- ✅ Comments system
- ✅ Feed with pagination
- ✅ Redis caching layer
- ✅ Email authorization check

## 🔄 Next Steps

1. **Get Upstash Redis credentials** and add to `.env.local`
2. **Update Google OAuth redirect URIs** in Google Cloud Console
3. **Test authentication flow** at `/community`
4. **Customize authorized domains** in `lib/googleSheetAuth.ts`

## 🐛 Troubleshooting

### NextAuth Error: "CLIENT_FETCH_ERROR"
- Ensure `.env.local` has all required variables
- Restart dev server after adding env variables
- Check Google OAuth redirect URIs match exactly

### Redis Connection Error
- Verify Upstash credentials in `.env.local`
- Check network connectivity to Upstash

### Authentication Not Working
- Clear browser cookies and cache
- Verify email domain is in authorized list
- Check browser console for detailed errors

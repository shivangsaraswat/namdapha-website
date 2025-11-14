# Upstash Redis Setup Guide

## Step 1: Create Upstash Account

1. Go to [https://console.upstash.com/](https://console.upstash.com/)
2. Sign up with Google or GitHub
3. Verify your email

## Step 2: Create Redis Database

1. Click "Create Database"
2. Choose:
   - **Name**: namdapha-community
   - **Type**: Regional (free tier)
   - **Region**: Choose closest to your users
   - **Eviction**: No eviction
3. Click "Create"

## Step 3: Get Credentials

1. Click on your database
2. Scroll to "REST API" section
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 4: Add to .env.local

```env
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

## Step 5: Restart Dev Server

```bash
cd frontend
npm run dev
```

## ✅ Done!

Your community feature now uses Redis for caching.

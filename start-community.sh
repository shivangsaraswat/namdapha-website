#!/bin/bash

echo "🚀 Starting Namdapha Community Feature"
echo ""

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "❌ Error: frontend/.env.local not found"
    echo "Please create it with required credentials"
    exit 1
fi

# Check for required env variables
if ! grep -q "NEXTAUTH_SECRET" frontend/.env.local; then
    echo "❌ Error: NEXTAUTH_SECRET not found in .env.local"
    exit 1
fi

if ! grep -q "GOOGLE_CLIENT_ID" frontend/.env.local; then
    echo "❌ Error: GOOGLE_CLIENT_ID not found in .env.local"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Check if Upstash Redis is configured
if grep -q "your-redis-url-here" frontend/.env.local; then
    echo "⚠️  Warning: Upstash Redis not configured"
    echo "   Using in-memory cache fallback"
    echo "   Get credentials from: https://console.upstash.com/"
    echo ""
fi

# Start the frontend
echo "🌐 Starting frontend on http://localhost:3001"
echo "📍 Community page: http://localhost:3001/community"
echo ""

cd frontend && npm run dev

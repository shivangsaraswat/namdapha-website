#!/bin/bash

echo "🚀 Deploying API to Railway..."

# Navigate to project root
cd "$(dirname "$0")/../.."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm i -g @railway/cli
fi

# Login to Railway (if not already logged in)
railway login

# Deploy to Railway
railway up

echo "✅ API deployed successfully!"
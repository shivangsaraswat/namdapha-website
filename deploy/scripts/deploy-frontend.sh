#!/bin/bash

echo "🚀 Deploying Frontend to Vercel..."

# Navigate to frontend directory
cd frontend

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy to Vercel
vercel --prod --yes

echo "✅ Frontend deployed successfully!"
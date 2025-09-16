#!/bin/bash

echo "🚀 Deploying Admin Dashboard to Vercel..."

# Navigate to admin dashboard directory
cd backend/admin-dashboard

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

# Deploy to Vercel
vercel --prod --yes

echo "✅ Admin Dashboard deployed successfully!"
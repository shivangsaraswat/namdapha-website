#!/bin/bash

echo "🚀 Deploying Both Frontend and Admin Dashboard to Firebase..."

# Build frontend
echo "📦 Building frontend..."
cd ../../frontend
npm run build

# Build admin dashboard
echo "📦 Building admin dashboard..."
cd ../backend/admin-dashboard
npm run build

# Copy builds to firebase directory
echo "📋 Copying build files..."
cd ../../deploy/firebase
rm -rf public/frontend public/admin
mkdir -p public/frontend public/admin
cp -r ../../frontend/out/* public/frontend/
cp -r ../../backend/admin-dashboard/out/* public/admin/

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"

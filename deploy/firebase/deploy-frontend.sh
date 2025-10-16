#!/bin/bash

echo "🚀 Deploying Frontend to Firebase..."

# Build frontend
echo "📦 Building frontend..."
cd ../../frontend
npm run build

# Copy build to firebase directory
echo "📋 Copying build files..."
cd ../deploy/firebase
rm -rf public/frontend
mkdir -p public/frontend
cp -r ../../frontend/out/* public/frontend/

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting:frontend

echo "✅ Frontend deployment complete!"

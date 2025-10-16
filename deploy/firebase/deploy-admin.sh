#!/bin/bash

echo "🚀 Deploying Admin Dashboard to Firebase..."

# Build admin dashboard
echo "📦 Building admin dashboard..."
cd ../../backend/admin-dashboard
npm run build

# Copy build to firebase directory
echo "📋 Copying build files..."
cd ../../deploy/firebase
rm -rf public/admin
mkdir -p public/admin
cp -r ../../backend/admin-dashboard/out/* public/admin/

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting:admin

echo "✅ Admin dashboard deployment complete!"

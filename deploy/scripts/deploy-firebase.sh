#!/bin/bash

# Firebase Deployment Script
# Usage: ./deploy-firebase.sh [functions|hosting|all]

set -e

echo "🔥 Firebase Deployment Script"
echo "=============================="

# Navigate to Firebase directory
cd "$(dirname "$0")/../firebase"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login check
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Build frontend first
echo "📦 Building frontend..."
cd ../../frontend
npm run build

# Copy build to Firebase public directory
echo "📋 Copying build to Firebase hosting..."
mkdir -p ../deploy/firebase/public
rm -rf ../deploy/firebase/public/frontend
mkdir -p ../deploy/firebase/public/frontend
cp -r out/* ../deploy/firebase/public/frontend/

# Return to Firebase directory
cd ../deploy/firebase

# Deploy based on argument
case "${1:-all}" in
    "functions")
        echo "🚀 Deploying Firebase Functions..."
        firebase deploy --only functions
        ;;
    "hosting")
        echo "🌐 Deploying Firebase Hosting..."
        firebase deploy --only hosting
        ;;
    "firestore")
        echo "🗄️ Deploying Firestore Rules..."
        firebase deploy --only firestore:rules,firestore:indexes
        ;;
    "all")
        echo "🚀 Deploying everything to Firebase..."
        firebase deploy
        ;;
    *)
        echo "❌ Invalid option. Use: functions, hosting, firestore, or all"
        exit 1
        ;;
esac

echo "✅ Firebase deployment completed!"
echo "🌐 Your app is live at: https://namdapha-website.web.app"
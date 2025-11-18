#!/bin/bash

echo "🔥 Deploying Firestore indexes..."

# Deploy only the indexes
firebase deploy --only firestore:indexes

echo "✅ Firestore indexes deployed successfully!"
echo ""
echo "📝 Note: Index creation may take a few minutes to complete."
echo "You can monitor the progress in the Firebase Console."
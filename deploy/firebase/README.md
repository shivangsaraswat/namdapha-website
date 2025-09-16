# Firebase Deployment Configuration

This directory contains all Firebase-related configuration and deployment files.

## 📁 Structure

```
deploy/firebase/
├── functions/              # Cloud Functions (API replacement)
├── firebase.json          # Firebase project configuration
├── .firebaserc           # Firebase project settings
├── firestore.rules       # Database security rules
├── firestore.indexes.json # Database query indexes
├── FIREBASE_SETUP.md     # Setup instructions
└── README.md             # This file
```

## 🚀 Quick Deploy

```bash
# Navigate to Firebase directory
cd deploy/firebase

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

## 🔧 Development

```bash
# Start local emulators
cd deploy/firebase
firebase emulators:start

# In another terminal - Frontend dev
cd ../../frontend
npm run dev
```

## 📋 Related Files

- **Frontend Firebase Config**: `frontend/lib/firebase.js`
- **Frontend API Functions**: `frontend/lib/api.js`
- **Environment Variables**: `frontend/.env.local`

## 🔗 Integration with Other Deployments

This Firebase setup replaces:
- **Railway API** (`deploy/railway/`) - Now using Firebase Functions
- **Vercel Frontend** (`deploy/vercel/frontend.json`) - Now using Firebase Hosting
- **Express API** (`backend/api/`) - Now using Firebase Functions

The admin dashboard (`backend/admin-dashboard/`) can still be deployed separately to Vercel using `deploy/vercel/admin.json`.
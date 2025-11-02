# Firebase Setup Instructions

## 🚀 Quick Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Create Firebase Project
```bash
# Go to https://console.firebase.google.com/
# Create new project: "namdapha-website"
# Enable Firestore, Authentication, Hosting, Functions
```

### 4. Initialize Firebase in Project
```bash
cd /Users/shivang/Developer/namdapha-website
firebase init

# Select:
✅ Firestore
✅ Functions  
✅ Hosting
✅ Storage (optional)
```

### 5. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Functions
cd ../functions
npm install
```

### 6. Configure Environment Variables
```bash
# Copy and fill Firebase config
cp frontend/.env.local.example frontend/.env.local

# Get config from Firebase Console → Project Settings → General → Your apps
```

### 7. Deploy to Firebase
```bash
# Build frontend
cd frontend
npm run build

# Deploy everything
cd ..
firebase deploy
```

## 🔧 Development Commands

### Local Development
```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal - Frontend dev
cd frontend && npm run dev
```

### Deploy Commands
```bash
# Deploy functions only
firebase deploy --only functions

# Deploy hosting only  
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

## 📊 Firebase Collections Structure

### Events Collection
```javascript
{
  id: "auto-generated",
  title: "Event Title",
  description: "Event description",
  date: "2024-01-15",
  location: "Event location",
  image: "image-url",
  status: "upcoming|completed"
}
```

### Council Collection
```javascript
{
  id: "auto-generated", 
  name: "Member Name",
  position: "President|Vice President|Secretary",
  house: "House Name",
  image: "image-url",
  bio: "Member biography"
}
```

### Teams Collection
```javascript
{
  id: "auto-generated",
  name: "Team Name", 
  description: "Team description",
  members: ["member1", "member2"],
  image: "team-image-url"
}
```

### Resources Collection
```javascript
{
  id: "auto-generated",
  title: "Resource Title",
  description: "Resource description", 
  url: "resource-url",
  category: "academic|sports|cultural",
  type: "pdf|link|video"
}
```

## 🔐 Security Rules

Current rules allow:
- **Public read** access to events, council, teams, resources
- **Authenticated write** access for general collections
- **Admin only** access to admin collection

## 💰 Cost Estimation

### Free Tier Limits:
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Functions**: 125K invocations, 40K GB-seconds per month
- **Hosting**: 10GB storage, 360MB/day transfer
- **Authentication**: 10K users

### Expected Usage:
- **Daily reads**: ~1K (well within limit)
- **Daily writes**: ~50 (well within limit)
- **Monthly function calls**: ~5K (well within limit)

**Estimated monthly cost: $0 (Free tier sufficient)**

## 🚨 Important Notes

1. **Remove old backend**: Delete `backend/api` folder after migration
2. **Update deployment**: Change from Railway to Firebase
3. **Environment variables**: Set up Firebase config in frontend
4. **Database migration**: Import existing data to Firestore
5. **Testing**: Test all API endpoints with new Firebase functions

## 📞 Support

- **Firebase Console**: https://console.firebase.google.com/
- **Documentation**: https://firebase.google.com/docs
- **CLI Reference**: https://firebase.google.com/docs/cli
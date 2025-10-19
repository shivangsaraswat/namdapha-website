# 🚀 Deploy Frontend to Firebase - Quick Guide

## Step 1: Open Terminal
Open your terminal and navigate to the project:
```bash
cd /Users/shivang/Developer/namdapha-website
```

## Step 2: Deploy Frontend Only
Run this single command:
```bash
./deploy/scripts/deploy-firebase.sh hosting
```

**OR** Deploy everything (frontend + functions + firestore):
```bash
./deploy/scripts/deploy-firebase.sh all
```

## Step 3: Wait for Deployment
The script will:
1. ✅ Build your Next.js frontend
2. ✅ Copy files to Firebase hosting directory
3. ✅ Deploy to Firebase Hosting
4. ✅ Show you the live URL

## Step 4: Access Your Live Site
After deployment completes, visit:
- **Frontend**: https://namdapha-website.web.app
- **Admin**: https://admin-namdapha-website.web.app

---

## 📝 Quick Commands Reference

| Command | What It Does |
|---------|-------------|
| `./deploy/scripts/deploy-firebase.sh hosting` | Deploy only frontend |
| `./deploy/scripts/deploy-firebase.sh functions` | Deploy only backend functions |
| `./deploy/scripts/deploy-firebase.sh firestore` | Deploy only database rules |
| `./deploy/scripts/deploy-firebase.sh all` | Deploy everything |

---

## 🧪 Test Before Deploying (Optional)

```bash
cd frontend
npm run build
npx serve out
```
Then visit http://localhost:3000

---

## ⚠️ Troubleshooting

### "Permission denied" error?
```bash
chmod +x deploy/scripts/deploy-firebase.sh
```

### "Firebase not found" error?
```bash
npm install -g firebase-tools
firebase login
```

### Build fails?
```bash
cd frontend
rm -rf .next out node_modules
npm install
npm run build
```

---

## 🎉 That's It!

Just run: `./deploy/scripts/deploy-firebase.sh hosting`

Your website will be live in ~2 minutes!

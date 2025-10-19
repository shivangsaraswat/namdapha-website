# Firebase Deployment Guide

## ✅ Configuration Complete

Your Firebase deployment is now properly configured to handle Next.js client-side routing.

## What Was Fixed

### 1. **next.config.ts**
- ✅ Re-enabled `output: 'export'` for static site generation
- ✅ Added `trailingSlash: true` for consistent routing
- ✅ Kept `images.unoptimized: true` for Firebase compatibility

### 2. **firebase.json**
- ✅ Added `cleanUrls: true` for clean URL paths
- ✅ Added `trailingSlash: false` for Firebase Hosting
- ✅ Updated rewrite rule to use `/404.html` (Next.js generates this)

### 3. **deploy-firebase.sh**
- ✅ Automatically copies `out/` directory to Firebase public folder
- ✅ Cleans previous builds before deployment

## How It Works

1. **Next.js Build**: Generates static HTML files in `out/` directory
2. **Firebase Hosting**: Serves static files with client-side routing
3. **Rewrites**: All routes fallback to 404.html which Next.js uses for client-side routing
4. **Router**: `useRouter()` handles navigation without page reloads

## Deployment Commands

### Deploy Everything
```bash
cd /Users/shivang/Developer/namdapha-website
./deploy/scripts/deploy-firebase.sh all
```

### Deploy Only Hosting (Frontend)
```bash
./deploy/scripts/deploy-firebase.sh hosting
```

### Deploy Only Functions
```bash
./deploy/scripts/deploy-firebase.sh functions
```

### Deploy Only Firestore Rules
```bash
./deploy/scripts/deploy-firebase.sh firestore
```

## Local Testing

Before deploying, test locally:

```bash
cd frontend
npm run build
npx serve out
```

Then visit `http://localhost:3000` and test:
- ✅ Navigation between pages
- ✅ Direct URL access (e.g., `/resources/pyqs`)
- ✅ Browser refresh on any page
- ✅ Back/forward buttons

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Already fixed! Firebase rewrites handle this.

### Issue: Images not loading
**Solution**: Already configured with `unoptimized: true`

### Issue: Navigation loops
**Solution**: Already fixed by using `router.push()` instead of `window.location.href`

## Important Notes

- ✅ All navigation now uses Next.js `useRouter()` for client-side routing
- ✅ No more `window.location.href` causing infinite loops
- ✅ Firebase Hosting serves static files with proper rewrites
- ✅ Clean URLs without `.html` extensions
- ✅ Full support for dynamic client-side navigation

## Next Steps

1. Clear your browser cache
2. Rebuild the project: `cd frontend && npm run build`
3. Deploy to Firebase: `./deploy/scripts/deploy-firebase.sh all`
4. Test your live site!

Your website will now work perfectly on Firebase Hosting! 🎉

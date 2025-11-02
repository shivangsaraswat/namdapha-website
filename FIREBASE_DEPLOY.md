# Firebase Deployment Guide

## Setup Multiple Sites

### 1. Create Firebase Sites
```bash
cd deploy/firebase

# Create admin site
firebase hosting:sites:create admin-namdapha-website

# List all sites
firebase hosting:sites:list
```

### 2. Configure Targets
```bash
# Link frontend to default site
firebase target:apply hosting frontend namdapha-website

# Link admin to admin site
firebase target:apply hosting admin admin-namdapha-website
```

### 3. Build Projects

**Frontend:**
```bash
cd frontend
npm run build
```

**Admin Dashboard:**
```bash
cd backend/admin-dashboard
npm run build
```

### 4. Deploy

**Deploy Both:**
```bash
cd deploy/firebase
firebase deploy --only hosting
```

**Deploy Frontend Only:**
```bash
firebase deploy --only hosting:frontend
```

**Deploy Admin Only:**
```bash
firebase deploy --only hosting:admin
```

## URLs

- **Frontend**: https://namdapha-website.web.app
- **Admin**: https://admin-namdapha-website.web.app

## Custom Domains (Optional)

```bash
# Add custom domain for frontend
firebase hosting:channel:deploy production --only frontend

# Add custom domain for admin
firebase hosting:channel:deploy production --only admin
```

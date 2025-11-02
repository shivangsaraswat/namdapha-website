# Maintenance Mode System

## Overview
Complete maintenance mode system that allows super-admin to control website availability from the admin dashboard with a single toggle.

## Features
✅ **One-Click Toggle**: Turn website ON/OFF instantly
✅ **Admin Dashboard Control**: Manage from `/admin/maintenance`
✅ **Custom Messages**: Set maintenance message and estimated end time
✅ **Firebase Storage**: Status stored in Firestore `settings/maintenance`
✅ **Super Admin Only**: Only super-admin can access maintenance controls
✅ **Real-time Updates**: Frontend checks status on every page load
✅ **Audit Trail**: Tracks who enabled/disabled and when

## How It Works

### 1. Admin Dashboard (`/admin/maintenance`)
- **Location**: `backend/admin-dashboard/src/app/admin/maintenance/page.tsx`
- **Access**: Super-admin only
- **Features**:
  - Big toggle button to turn website ON/OFF
  - Custom maintenance message editor
  - Optional estimated end time
  - Shows current status (ONLINE/OFFLINE)
  - Displays last modified by and timestamp

### 2. Frontend Check
- **Component**: `frontend/components/MaintenanceCheck.tsx`
- **Behavior**: 
  - Checks maintenance status on app load
  - Redirects to `/maintenance` if enabled
  - Shows loading spinner during check

### 3. Maintenance Page
- **Location**: `frontend/app/maintenance/page.tsx`
- **Design**: Beautiful maintenance page with:
  - Animated construction icon
  - Custom message from admin
  - Estimated end time (if set)
  - Contact information
  - "Try Again" button

### 4. Firebase Storage
- **Collection**: `settings`
- **Document**: `maintenance`
- **Structure**:
```typescript
{
  isEnabled: boolean,
  message: string,
  estimatedEndTime?: string,
  enabledBy?: string,
  enabledAt?: Date
}
```

## Usage

### For Super Admin:

1. **Access Maintenance Control**:
   - Login to admin dashboard
   - Click "Maintenance" in sidebar (Power icon)
   - Or navigate to `/admin/maintenance`

2. **Turn Website OFF**:
   - Click "Turn OFF Website" button
   - Customize maintenance message (optional)
   - Set estimated end time (optional)
   - Click "Save Settings"
   - Website is now offline for all visitors

3. **Turn Website ON**:
   - Click "Turn ON Website" button
   - Website is immediately accessible again

### For Visitors:
- When maintenance mode is enabled, all visitors see the maintenance page
- They can try refreshing or come back later
- Contact information is provided for urgent matters

## Files Created/Modified

### Backend (Admin Dashboard):
1. `src/lib/maintenanceService.ts` - Service for maintenance operations
2. `src/app/admin/maintenance/page.tsx` - Maintenance control page
3. `src/components/Sidebar.tsx` - Added maintenance menu item

### Frontend:
1. `lib/maintenanceService.ts` - Service to check maintenance status
2. `app/maintenance/page.tsx` - Maintenance display page
3. `components/MaintenanceCheck.tsx` - Wrapper component for checks
4. `app/layout.tsx` - Integrated maintenance check

## Security
- ✅ Only super-admin can access maintenance controls
- ✅ Protected by AuthGuard with `requiredPermission="*"`
- ✅ Firebase security rules should restrict `settings/maintenance` writes to admin users

## Firebase Security Rules
Add to your `firestore.rules`:
```
match /settings/{document} {
  allow read: if true;
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/authorized_users/$(request.auth.token.email)).data.role == 'super-admin';
}
```

## Testing
1. Login as super-admin
2. Go to Maintenance page
3. Toggle maintenance mode ON
4. Open frontend in incognito window
5. Should see maintenance page
6. Toggle maintenance mode OFF
7. Refresh frontend - should see normal website

## Benefits
- ✅ **Zero Downtime Control**: Instant ON/OFF
- ✅ **Professional**: Custom messages for users
- ✅ **Flexible**: Set estimated end times
- ✅ **Trackable**: Know who made changes and when
- ✅ **User-Friendly**: Beautiful maintenance page
- ✅ **Admin-Friendly**: Simple toggle interface

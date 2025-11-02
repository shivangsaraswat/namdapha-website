# Delete Permissions System - Database Structure

## Overview
All delete permissions are stored in **Firebase Firestore** (cloud database), NOT local storage.

## Database Structure

### Collection: `users`
Each document is identified by the user's email address.

```
users/
  ├── user@example.com/
  │   ├── email: "user@example.com"
  │   ├── role: "coordinator" | "web-admin" | "deputy-secretary" | "secretary" | "super-admin"
  │   ├── isActive: true | false
  │   ├── deletePermissions: {
  │   │   council-leadership: true | false
  │   │   council-coordinators: true | false
  │   │   teams: true | false
  │   │   events: true | false
  │   │   certificates: true | false
  │   │   link-tree-social: true | false
  │   │   link-tree-important: true | false
  │   │   resource-hub-pyqs: true | false
  │   │   resource-hub-contacts: true | false
  │   │   forms: true | false
  │   │   }
  │   ├── lastLogin: Timestamp
  │   └── createdAt: Timestamp
```

## How It Works

### 1. **Granting Permissions** (Super Admin Only)
- Super admin opens User Management page
- Clicks "Permissions" button next to a user
- Toggles permissions (Green = Granted, Gray = Denied)
- Clicks "Save to Database"
- Data is saved to Firestore: `users/{email}/deletePermissions`

### 2. **Checking Permissions** (All Pages)
- When user tries to delete something, system calls `canDelete(email, role, resource)`
- Function fetches user data from Firestore
- Checks if `deletePermissions[resource] === true`
- Super admin always returns `true` (bypass check)
- Returns `true` (allowed) or `false` (denied)

### 3. **Offline Handling**
- Online/Offline indicator in permissions dialog
- Save button disabled when offline
- Error messages if internet connection fails
- Permission checks return `false` if database unreachable (safe default)

## Internet Connection Required

✅ **YES** - Internet connection is required for:
- Fetching user permissions from Firestore
- Saving permission changes
- Checking delete permissions in real-time

❌ **NO** - The system does NOT use:
- Local storage
- Session storage
- Browser cache for permissions
- Offline mode

## Testing Database Connection

1. Open browser DevTools → Network tab
2. Grant/revoke permissions in User Management
3. Look for Firestore API calls to `firestore.googleapis.com`
4. Check Firestore console: https://console.firebase.google.com/
5. Navigate to Firestore Database → `users` collection
6. Verify `deletePermissions` field is updated

## Security

- Only super-admin can modify permissions
- All permission checks happen server-side via Firestore
- Permissions cannot be modified from browser console
- Offline users cannot delete anything (safe default)

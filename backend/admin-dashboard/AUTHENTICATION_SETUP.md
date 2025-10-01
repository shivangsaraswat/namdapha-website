# Authentication Setup Guide

## Overview

This admin dashboard implements a comprehensive authentication system with:
- Google OAuth authentication
- Role-based access control (RBAC)
- Activity logging
- User management (Super Admin only)

## Roles & Permissions

### Available Roles:
1. **Super Admin** - Full access to everything
2. **Secretary** - Dashboard, Events, Resource Hub, Council, Teams, Certificates
3. **Deputy Secretary** - Dashboard, Events, Resource Hub, Teams
4. **Web Admin** - Dashboard, Resource Hub, Link Tree, Forms
5. **Coordinator** - Dashboard, Events, Teams

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 2. Environment Variables

Update `.env.local` with your credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Authorized Users Configuration

Edit `src/lib/auth.ts` and add authorized users:

```typescript
const authorizedUsers: Record<string, { role: UserRole; isActive: boolean }> = {
  "admin@namdapha.org": { role: "super-admin", isActive: true },
  "secretary@namdapha.org": { role: "secretary", isActive: true },
  "deputy@namdapha.org": { role: "deputy-secretary", isActive: true },
  "webadmin@namdapha.org": { role: "web-admin", isActive: true },
  "coordinator@namdapha.org": { role: "coordinator", isActive: true },
};
```

## Features

### Authentication Flow
1. User visits any protected route
2. Redirected to `/auth/signin` if not authenticated
3. Google OAuth login
4. Email validation against authorized users
5. Role-based dashboard access

### User Management (Super Admin Only)
- Add/remove users
- Assign roles
- Activate/deactivate users
- View user activity

### Activity Logging
- Login/logout tracking
- User actions monitoring
- IP address logging
- Timestamp tracking

### Route Protection
- Middleware-level protection
- Component-level guards
- Permission-based access

## Usage

### Protecting Routes
```tsx
import AuthGuard from "@/components/AuthGuard";

export default function ProtectedPage() {
  return (
    <AuthGuard requiredPermission="events">
      {/* Your page content */}
    </AuthGuard>
  );
}
```

### Checking Permissions
```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { hasPermission } = useAuth();
  
  if (hasPermission("events")) {
    return <EventsButton />;
  }
  
  return null;
}
```

### Logging Activities
```tsx
import { logActivity } from "@/lib/activityLogger";

// Log user action
logActivity(userId, "CREATE_EVENT", "Created Annual Conference", ipAddress);
```

## Security Features

- JWT-based sessions
- Role-based access control
- Route protection middleware
- Activity monitoring
- IP address tracking
- Secure OAuth flow

## Development

1. Install dependencies: `npm install`
2. Set up environment variables
3. Configure authorized users
4. Run development server: `npm run dev`
5. Access dashboard at `http://localhost:3000`

## Production Deployment

1. Update `NEXTAUTH_URL` to production domain
2. Configure production Google OAuth credentials
3. Set up proper database for user storage
4. Enable HTTPS
5. Configure proper session security

## Database Integration

Currently using in-memory storage. For production:

1. Set up database (PostgreSQL, MongoDB, etc.)
2. Replace mock storage in:
   - `src/lib/auth.ts` (user management)
   - `src/lib/activityLogger.ts` (activity logs)
3. Implement proper data persistence
4. Add database migrations

## Troubleshooting

### Common Issues:

1. **OAuth Error**: Check Google OAuth configuration and redirect URIs
2. **Access Denied**: Verify user email is in authorized users list
3. **Session Issues**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
4. **Permission Errors**: Verify role permissions in auth configuration

### Debug Mode:
Set `NEXTAUTH_DEBUG=true` in environment variables for detailed logs.
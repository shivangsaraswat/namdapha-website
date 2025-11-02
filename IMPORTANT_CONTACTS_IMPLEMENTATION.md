# Important Contacts Page - Implementation Guide

## Overview
A redesigned Important Contacts page with 6 categories, modern card design, and full Firebase integration for dynamic content management through the admin dashboard.

## Categories

1. **House Leadership** (Crown icon) - Namdapha House leaders
2. **PODs** (Target icon) - POD coordinators and members
3. **Student Executive Committee** (ClipboardList icon) - SEC members
4. **Paradox** (Drama icon) - Paradox team contacts
5. **Placement** (Briefcase icon) - Placement cell contacts
6. **Others** (Phone icon) - General contacts

## Features

### Frontend (`/resources/important-contacts`)
- **Modern Design**: Dark theme with gradient cards and hover effects
- **Category Tabs**: Horizontal scrollable tabs with lucide-react icons
- **Responsive Cards**: 
  - Profile image with gradient border
  - Name, role, and description
  - Email with click-to-mail functionality
  - Smooth hover animations
- **Empty States**: Friendly messages when no contacts exist
- **Loading States**: Spinner during data fetch

### Admin Dashboard (`/resource-hub/important-contacts`)
- **Unified Interface**: All 6 categories in one page
- **Add/Edit Contacts**: 
  - Category selection
  - Name, role, email (required)
  - Description (optional)
  - Profile photo upload via Cloudinary
- **Visibility Toggle**: Show/hide contacts without deletion
- **Delete Protection**: Permission-based deletion
- **Real-time Updates**: Instant sync with Firebase

## Data Structure

### Firebase Collection: `contacts`

```typescript
{
  id: string;
  name: string;              // Contact name
  role: string;              // Designation/role
  email: string;             // Email address
  photoUrl?: string;         // Profile image URL
  description?: string;      // Short description
  category: 'leadership' | 'pods' | 'sec' | 'paradox' | 'placement' | 'others';
  status: 'active' | 'inactive';
  order: number;             // Display order
  createdAt: Date;
  updatedAt: Date;
}
```

## Files Modified/Created

### Frontend
- ✅ `/frontend/app/resources/important-contacts/page.tsx` - Redesigned page
- ✅ `/frontend/lib/contactService.ts` - Updated interface
- ✅ `/frontend/app/globals.css` - Added scrollbar-hide utility

### Admin Dashboard
- ✅ `/backend/admin-dashboard/src/app/resource-hub/[category]/ContactManagement.tsx` - New unified interface
- ✅ `/backend/admin-dashboard/src/lib/contactService.ts` - Updated interface

## Usage

### For Admins

1. **Navigate to Resource Hub** → Important Contacts
2. **Add Contact**:
   - Click "Add Contact" button for any category
   - Fill in required fields (name, role, email)
   - Optionally add description and photo
   - Click "Add Contact"
3. **Edit Contact**: Click edit icon, modify fields, save
4. **Toggle Visibility**: Click eye icon to show/hide
5. **Delete Contact**: Click trash icon (requires permission)

### For Users

1. Visit `/resources/important-contacts`
2. Click category tabs to filter contacts
3. View contact details in cards
4. Click email to send message

## Design Highlights

- **Color Scheme**: Purple gradient accents on dark background
- **Typography**: Large, readable fonts with proper hierarchy
- **Animations**: Smooth hover effects and transitions
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Mobile-First**: Responsive grid layout (1/2/3 columns)

## Firebase Integration

- **Real-time Sync**: Changes in admin reflect instantly on frontend
- **Caching**: 60-second cache for performance
- **Offline Support**: IndexedDB persistence enabled
- **Security**: Firestore rules control access

## Next Steps

1. **Add Firestore Rules**:
```javascript
match /contacts/{contactId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

2. **Test Data**: Add sample contacts in each category
3. **Deploy**: Push changes and deploy to production

## Support

For issues or questions, contact the development team.

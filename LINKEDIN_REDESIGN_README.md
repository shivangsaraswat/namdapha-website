# LinkedIn-Inspired Community Redesign

## 🎨 Overview

This is a complete redesign of the Namdapha House community platform, featuring a modern LinkedIn-inspired interface with full profile management capabilities and responsive design.

## ✨ Key Features

### 1. **LinkedIn-Style Layout**
- **Three-column design** on desktop (Profile, Feed, Recommendations)
- **Responsive breakpoints**: Collapses to 2 columns on tablets, single column on mobile
- **Sticky navigation bar** with search, notifications, and quick actions
- **Clean, modern UI** with rounded corners (rounded-2xl), soft shadows, and smooth transitions

### 2. **Enhanced Profile Management**
Users can now fully customize their profiles with:
- ✅ Profile picture upload
- ✅ Cover/banner image upload
- ✅ Name and username
- ✅ Professional headline (e.g., "UI/UX Designer at Company")
- ✅ Bio/About section
- ✅ Location
- ✅ Portfolio website URL
- ✅ Hobbies (comma-separated)
- ✅ Resume upload (PDF)
- ✅ Live preview of changes before saving

### 3. **New Components**

#### ProfileSidebar.tsx
- User profile card with banner background
- Circular profile image overlay
- Stats: Posts, Followers, Following
- Additional metrics: Profile views, Post impressions
- Quick navigation: My Network, Saved, Events, Groups
- Premium CTA card (gold gradient)
- Footer links

#### RecommendationsSidebar.tsx
- Tabbed interface: Network | Jobs | Groups
- **Network Tab**: Recommended connections with mutual count
- **Jobs Tab**: Job recommendations
- **Groups Tab**: Suggested groups
- Trending topics with post counts
- Companies/pages to follow
- Community guidelines card

#### PostComposer.tsx
- Expandable post creation interface
- "Start a post..." button that expands on click
- Support for text, images (up to 4), videos, documents, events
- Media preview with remove option
- Action buttons with icons

#### EditProfileModal.tsx
- Full-screen modal for profile editing
- Cover and profile image upload with hover preview
- All profile fields editable
- Resume upload (PDF only)
- Form validation
- Loading states

#### LinkedInNavbar.tsx
- Logo + Search bar
- Navigation icons: Home, Network, Jobs, Messages, Notifications
- Profile dropdown menu
- Responsive mobile menu
- Badge indicators for notifications

#### PostCard.tsx (Updated)
- Larger user avatars (48px)
- Professional role subtitle
- Globe icon for public posts
- Engagement stats with icon badges
- Action buttons: Like (ThumbsUp), Comment, Repost, Send
- Improved media grid layout
- Link preview cards

### 4. **Database Structure**

Updated Firebase/Firestore schema for `communityUsers`:

```typescript
{
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  resume?: string;  // URL to uploaded resume
  hobbies?: string[];
  profileImage?: string;
  coverImage?: string;
  status: 'active' | 'suspended' | 'deactivated' | 'deleted';
  role: 'member' | 'moderator';
  createdAt: Date;
  lastActive: Date;
  stats: {
    posts: number;
    followers: number;
    following: number;
    profileViews: number;
    postImpressions: number;
  }
}
```

### 5. **Responsive Design**

**Desktop (≥1024px)**:
- 3-column layout: Profile (25%) | Feed (50%) | Recommendations (25%)
- Full navigation with icons and labels
- Expanded sidebars

**Tablet (768px - 1023px)**:
- 2-column layout: Feed + Right sidebar
- Collapsible navigation
- Profile accessible via dropdown

**Mobile (< 768px)**:
- Single column feed
- Hamburger menu navigation
- Bottom sticky actions for important features

### 6. **Color Palette**

Following LinkedIn's modern design:
- **Primary Blue**: `#0A66C2` / `blue-600`
- **Text Primary**: `#000000` / `gray-900`
- **Text Secondary**: `#666666` / `gray-600`
- **Text Muted**: `#00000099` / `gray-500`
- **Background**: `#F3F2EF` / `gray-50`
- **Card Background**: `#FFFFFF` / `white`
- **Borders**: `#E5E7EB` / `gray-200`
- **Hover**: `#F9FAFB` / `gray-100`

### 7. **Typography**

- **Font Family**: System font stack (default Next.js)
- **Card Titles**: `font-semibold text-sm`
- **Body Text**: `text-sm text-gray-900`
- **Metadata**: `text-xs text-gray-600`
- **Actions**: `text-sm font-medium`

## 🚀 Implementation Guide

### Step 1: Install Dependencies

All dependencies should already be installed. Key packages:
```bash
npm install next-auth firebase date-fns lucide-react sonner
```

### Step 2: Update Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Step 3: File Structure

```
frontend/
├── app/
│   └── community/
│       ├── layout.tsx (Updated with LinkedInNavbar)
│       └── page.tsx (Updated with new components)
├── components/
│   └── community/
│       ├── ProfileSidebar.tsx (NEW)
│       ├── RecommendationsSidebar.tsx (NEW)
│       ├── EditProfileModal.tsx (NEW)
│       ├── PostComposer.tsx (NEW)
│       ├── LinkedInNavbar.tsx (NEW)
│       ├── PostCard.tsx (UPDATED)
│       ├── AuthModal.tsx
│       └── CommunityFooter.tsx
└── lib/
    └── communityService.ts (Already supports new fields)
```

### Step 4: Run the Application

```bash
cd frontend
npm run dev
```

Navigate to: `http://localhost:3000/community`

## 🎯 Key User Flows

### Editing Profile
1. Click "Edit Profile" button in left sidebar
2. Upload cover image (click on cover to upload)
3. Upload profile picture (hover and click camera icon)
4. Fill in all profile fields
5. Upload resume (PDF only)
6. Click "Save Changes"
7. Profile updates across all posts and cards

### Creating a Post
1. Click "Start a post..." in feed
2. Composer expands with full editing interface
3. Type content
4. Click Photo icon to add images (max 4)
5. Preview images appear with remove option
6. Click "Post" to publish
7. Post appears at top of feed immediately

### Interacting with Posts
1. **Like**: Click thumbs-up icon (turns blue when liked)
2. **Comment**: Click comment icon (opens comment section - to be implemented)
3. **Repost**: Share to your network
4. **Send**: Share via message
5. **Save**: Bookmark for later

## 📱 Mobile Optimizations

- Hamburger menu for navigation
- Full-width feed cards
- Touch-friendly button sizes (min 44px)
- Swipe gestures for image galleries
- Bottom navigation for key actions
- Collapsible sections for better space usage

## 🔧 Customization Options

### Change Primary Color
Update all instances of:
- `bg-blue-600` → `bg-[your-color]-600`
- `text-blue-600` → `text-[your-color]-600`
- `border-blue-600` → `border-[your-color]-600`

### Add More Profile Fields
1. Update `CommunityUser` interface in `communityService.ts`
2. Add fields to `EditProfileModal.tsx` form
3. Update Firestore security rules if needed

### Customize Post Types
Edit `PostComposer.tsx` to add:
- Polls
- Articles
- Job postings
- Events

## 🐛 Troubleshooting

### Images not uploading
- Check Cloudinary configuration in `lib/cloudinary.ts`
- Verify Firebase Storage rules
- Ensure file size limits

### Profile not updating
- Check browser console for errors
- Verify Firebase connection
- Ensure user has proper permissions

### Styling issues
- Clear browser cache
- Run `npm run build` to rebuild
- Check Tailwind config for custom classes

## 📊 Performance Optimizations

- **Image optimization**: Next.js Image component with lazy loading
- **Code splitting**: Dynamic imports for modals
- **Caching**: Redis caching for feed data (already implemented)
- **Infinite scroll**: Can be added for feed pagination
- **Debounced search**: Reduce API calls

## 🎨 Design Tokens

```css
/* Spacing */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */

/* Border Radius */
--radius-sm: 0.5rem;    /* 8px */
--radius-md: 0.75rem;   /* 12px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## 🚀 Future Enhancements

- [ ] Real-time notifications
- [ ] Chat/messaging system
- [ ] Video post support
- [ ] Story/status updates
- [ ] Advanced analytics dashboard
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements (ARIA labels)
- [ ] PWA support
- [ ] Email notifications

## 📝 License

This project is part of the Namdapha House community platform.

---

**Built with ❤️ using Next.js, React, Tailwind CSS, and Firebase**

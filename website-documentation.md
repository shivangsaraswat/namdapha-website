# Namdapha Website - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Features & Functionality](#features--functionality)
4. [Database Structure](#database-structure)
5. [API & Services](#api--services)
6. [Frontend Components](#frontend-components)
7. [Authentication & Security](#authentication--security)
8. [Deployment & Infrastructure](#deployment--infrastructure)
9. [Development Guidelines](#development-guidelines)
10. [Contributing Guide](#contributing-guide)

## 🏠 Project Overview

**Namdapha House** is the premier student community website for IIT Madras BS Degree program, serving 5000+ students through academics, events, and leadership opportunities.

### Key Statistics
- **5000+** Active Members
- **50+** Events Annually  
- **11** Activity Communities
- **24/7** Community Support

### Primary Goals
- Connect students across regions
- Provide academic resources and support
- Organize events and workshops
- Foster community engagement
- Enable leadership development

## 🏗️ Architecture & Tech Stack

### Frontend (Deployed on Vercel)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Image Optimization**: Next.js Image + Sharp

### Backend (Firebase Functions)
- **Database**: Firestore (NoSQL)
- **Authentication**: NextAuth.js + Google OAuth
- **Functions**: Firebase Cloud Functions (Node.js 18)
- **File Storage**: Cloudinary
- **Caching**: Redis (Upstash)

### Deployment Infrastructure
- **Frontend**: Vercel (Production)
- **Backend**: Firebase Functions
- **Database**: Firestore
- **CDN**: Cloudinary for images
- **Monitoring**: Built-in Firebase Analytics

## 🚀 Features & Functionality

### 1. Homepage (`/`)
**Purpose**: Main landing page showcasing Namdapha House

**Key Sections**:
- Hero section with animated logo and lightning background
- About section with community statistics
- What We Do cards (6 main activities)
- Activities showcase
- Events carousel
- Success stories
- Image gallery

**Components Used**:
- `LightningBackground` - Animated SVG background
- `DesignGallery` - Rotating design showcase
- `EventCarousel` - Upcoming events slider
- `SuccessStories` - Member achievements
- `ImageGallery` - Photo gallery
- `Activites` - Community activities

### 2. Council Page (`/council`)
**Purpose**: Display current house leadership and regional coordinators

**Features**:
- House Leadership section (UHC members)
- Regional Coordinators grid (RC members)
- Dynamic poster-style member cards
- Responsive layout for different screen sizes

**Data Source**: `council` Firestore collection
**Service**: `councilService.ts`

### 3. Teams Page (`/teams`)
**Purpose**: Showcase team members across different categories

**Categories**:
- WebOps Team
- Multimedia Team  
- Outreach Team

**Data Source**: `teams` Firestore collection
**Service**: `teamService.ts`

### 4. Events Page (`/events`)
**Purpose**: Display upcoming and past events with filtering

**Features**:
- Upcoming events carousel with auto-rotation
- Past events grid with category filtering
- Event detail modal with full information
- Load more functionality with auto-collapse
- Google Meet integration for virtual events

**Categories**: Paradox, Workshops, Meetups, Other Events
**Data Source**: `events` Firestore collection

### 5. Resource Hub (`/resources`)
**Purpose**: Central hub for academic resources and tools

**Main Categories**:
- **Important Contacts** (`/resources/important-contacts`)
- **Notes** (`/resources/notes`) 
- **PYQs** (`/resources/pyqs`)
- **Video Lectures** (`/resources/video-lectures`)
- **Recommended Books** (`/resources/recommended-books`)
- **WhatsApp Groups** (Dynamic)

**Features**:
- Dynamic category cards with icons
- Search and filter functionality
- Resource click tracking
- External link handling
- Empty state management

**Data Sources**: 
- `resourceCategories` collection
- `resources` collection
- Individual service files for each category

### 6. WhatsApp Integration (`/whatsapp`)
**Purpose**: Community onboarding through WhatsApp groups

**Features**:
- Embedded Google Form for group joining
- Loading states and error handling
- Responsive iframe integration

### 7. Link Tree (`/link-tree`)
**Purpose**: Quick access to important external links

**Data Source**: `links` Firestore collection
**Service**: `linkService.ts`

### 8. Certificate Verification (`/verify-certificate`)
**Purpose**: Verify authenticity of Namdapha certificates

### 9. Maintenance Mode (`/maintenance`)
**Purpose**: Site-wide maintenance with custom messaging

**Features**:
- Dynamic maintenance status from Firestore
- Development environment bypass
- Estimated completion time display
- Automatic redirect system

## 🗄️ Database Structure

### Firestore Collections

#### `events`
```typescript
interface Event {
  id: string;
  title: string;
  category: 'Paradox' | 'Workshops' | 'Meetups' | 'Other Events';
  type: 'upcoming' | 'past';
  status: 'active' | 'inactive';
  date: string;
  time?: string;
  venue?: string;
  meetLink?: string;
  imageUrl: string;
  description: string;
  order?: number;
}
```

#### `council`
```typescript
interface CouncilMember {
  id: string;
  name: string;
  position: string;
  type: 'leadership' | 'coordinator';
  imageUrl?: string;
  isVisible: boolean;
  order?: number;
  createdAt?: Date;
}
```

#### `teams`
```typescript
interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: 'webops' | 'multimedia' | 'outreach';
  imageUrl?: string;
  isVisible: boolean;
  order: number;
  createdAt?: Date;
}
```

#### `activities`
```typescript
interface Activity {
  id: string;
  name: string;
  description: string;
  logo: string;
  poster: string;
  category: string;
  registrationLink?: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `resourceCategories`
```typescript
interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // React Icon name
  iconColor: string; // Tailwind color class
  bgColor: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `resources`
```typescript
interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  downloads?: number;
  clicks?: number;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}
```

#### `settings/maintenance`
```typescript
interface MaintenanceMode {
  isEnabled: boolean;
  message: string;
  estimatedEndTime?: string;
  testInDevelopment?: boolean;
}
```

## 🔧 API & Services

### Firebase Functions (`/deploy/firebase/functions/index.js`)

**Base URL**: Firebase Functions endpoint

**Available Endpoints**:
- `GET /api/events` - Fetch all events
- `GET /api/council` - Fetch council members  
- `GET /api/teams` - Fetch team members
- `GET /api/resources` - Fetch resources
- `POST /api/contact` - Submit contact form

### Frontend Services

#### Core Services
- **`firebase.ts`** - Firebase configuration and initialization
- **`cache.ts`** - Aggressive caching with localStorage persistence
- **`maintenanceService.ts`** - Maintenance mode management

#### Data Services
- **`activitiesService.ts`** - Activities CRUD operations
- **`councilService.ts`** - Council members with caching
- **`teamService.ts`** - Team members management
- **`resourceService.ts`** - Resource categories and items
- **`linkService.ts`** - External links management
- **`contactService.ts`** - Contact information
- **`notesService.ts`** - Academic notes
- **`pyqService.ts`** - Previous year questions
- **`bookService.ts`** - Recommended books
- **`videoLectureService.ts`** - Video lectures

#### Utility Services
- **`cloudinary.ts`** - Image upload and management
- **`preload.ts`** - Data preloading for performance
- **`utils.ts`** - Common utility functions

## 🎨 Frontend Components

### Layout Components
- **`Navbar.tsx`** - Responsive navigation with glassmorphism
- **`Footer.tsx`** - Standard footer
- **`ConditionalFooter.tsx`** - Context-aware footer display
- **`EventFooter.tsx`** - Special footer for events page
- **`PageWrapper.tsx`** - Page layout wrapper
- **`MaintenanceCheck.tsx`** - Maintenance mode checker

### UI Components (`/components/ui/`)
- **`button.tsx`** - Reusable button variants
- **`card.tsx`** - Card layouts
- **`input.tsx`** - Form inputs
- **`select.tsx`** - Dropdown selects
- **`dialog.tsx`** - Modal dialogs
- **`badge.tsx`** - Status badges
- **`sheet.tsx`** - Side panels

### Feature Components
- **`LightningBackground.tsx`** - Animated SVG background
- **`DesignGallery.tsx`** - Rotating design showcase
- **`EventCarousel.tsx`** - Events slider
- **`SuccessStories.tsx`** - Member achievements
- **`ImageGallery.tsx`** - Photo gallery
- **`Activites.tsx`** - Activities showcase
- **`LoadingSpinner.tsx`** - Loading states
- **`ScrollReveal.tsx`** - Scroll animations

### Specialized Components
- **`GlowingBackground.tsx`** - Glowing effects
- **`AnimatedGallery.tsx`** - Animated image galleries
- **`PreloadData.tsx`** - Data preloading component

## 🔐 Authentication & Security

### NextAuth.js Configuration
**File**: `/frontend/lib/auth.ts`

**Providers**:
- Google OAuth 2.0

**Environment Variables**:
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Firestore Security Rules
**File**: `/deploy/firebase/firestore.rules`

**Rules**:
- Public read access for: events, council, teams, resources
- Authenticated write access for all collections
- Admin-only access for admin collection

### Security Headers (Vercel)
**File**: `/frontend/vercel.json`

**Headers**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- Cache control for static assets

## 🚀 Deployment & Infrastructure

### Frontend Deployment (Vercel)
**Configuration**: `/frontend/vercel.json`

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Framework: Next.js

**Environment Variables Required**:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Backend Deployment (Firebase)
**Configuration**: `/deploy/firebase/firebase.json`

**Services**:
- **Functions**: Node.js 18 runtime
- **Firestore**: Database with indexes
- **Hosting**: For admin dashboard (separate)

**Deployment Commands**:
```bash
# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy

# Deploy with specific project
firebase use your-project-id
firebase deploy
```

### Database Indexes
**File**: `/deploy/firebase/firestore.indexes.json`

**Indexes**:
- Events: `date` (DESC) + `status` (ASC)

## 💻 Development Guidelines

### Getting Started

1. **Clone Repository**
```bash
git clone <repository-url>
cd namdapha-website
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure environment variables
npm run dev
```

3. **Firebase Setup**
```bash
cd deploy/firebase
npm install -g firebase-tools
firebase login
firebase use your-project-id
```

### Code Structure

```
namdapha-website/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                # Services and utilities
│   └── public/             # Static assets
├── backend/                # Legacy backend (deprecated)
└── deploy/                 # Deployment configurations
    ├── firebase/           # Firebase config
    ├── vercel/            # Vercel config
    └── scripts/           # Deployment scripts
```

### Coding Standards

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations
- Avoid `any` type

#### React/Next.js
- Use functional components with hooks
- Implement proper error boundaries
- Use Next.js Image component for optimization
- Follow App Router conventions

#### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS custom properties for themes
- Maintain consistent spacing scale

#### Performance
- Implement proper caching strategies
- Use React.memo for expensive components
- Optimize images and assets
- Minimize bundle size

### Data Management

#### Firestore Best Practices
- Use subcollections for hierarchical data
- Implement proper indexing
- Use batch operations for multiple writes
- Handle offline scenarios

#### Caching Strategy
- Use `DataCache` class for client-side caching
- Set appropriate TTL values
- Clear cache on data mutations
- Implement cache invalidation

#### State Management
- Use React hooks for local state
- Implement context for global state
- Use SWR/React Query for server state
- Minimize prop drilling

### Error Handling

#### Frontend
- Implement error boundaries
- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors for debugging

#### Backend
- Use proper HTTP status codes
- Implement request validation
- Handle Firebase errors gracefully
- Return consistent error formats

## 🤝 Contributing Guide

### Adding New Features

#### 1. New Page
```bash
# Create page file
touch frontend/app/new-page/page.tsx

# Add to navigation
# Edit frontend/components/Navbar.tsx
```

#### 2. New Component
```bash
# Create component
touch frontend/components/NewComponent.tsx

# Export from index if needed
```

#### 3. New Service
```bash
# Create service file
touch frontend/lib/newService.ts

# Follow existing service patterns
```

#### 4. New Database Collection
```typescript
// Define interface
interface NewCollection {
  id: string;
  // ... other fields
}

// Create service
export const newService = {
  async getAll(): Promise<NewCollection[]> {
    // Implementation
  }
}

// Update Firestore rules if needed
```

### Database Operations

#### Adding New Data
```typescript
// Use appropriate service
import { newService } from '@/lib/newService';

// Add data
const id = await newService.add(data);

// Clear relevant caches
DataCache.clear('cache_key');
```

#### Updating Existing Data
```typescript
// Update with service
await newService.update(id, updates);

// Clear caches
DataCache.clearAll(); // or specific keys
```

### UI/UX Guidelines

#### Design System
- Follow existing color palette
- Use consistent typography scale
- Maintain spacing consistency
- Implement proper loading states

#### Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios

#### Responsive Design
- Mobile-first approach
- Test on multiple screen sizes
- Use appropriate breakpoints
- Optimize touch interactions

### Testing

#### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Forms submit successfully
- [ ] Images load and display
- [ ] Responsive design works
- [ ] Loading states appear
- [ ] Error handling works

#### Performance Testing
- [ ] Page load times < 3s
- [ ] Images are optimized
- [ ] Bundle size is reasonable
- [ ] Caching works properly

### Deployment Process

#### Frontend (Vercel)
1. Push to main branch
2. Vercel auto-deploys
3. Verify deployment
4. Test production site

#### Backend (Firebase)
```bash
cd deploy/firebase
firebase deploy --only functions
```

#### Database Updates
1. Update Firestore rules if needed
2. Add new indexes if required
3. Test with production data
4. Monitor for errors

### Maintenance Tasks

#### Regular Updates
- Update dependencies monthly
- Review and optimize performance
- Clean up unused code
- Update documentation

#### Monitoring
- Check Firebase usage quotas
- Monitor Vercel analytics
- Review error logs
- Track performance metrics

#### Backup
- Export Firestore data regularly
- Backup environment variables
- Document configuration changes
- Maintain deployment scripts

---

## 📞 Support & Contact

For technical issues or questions about contributing:
1. Check existing documentation
2. Review similar implementations
3. Test in development environment
4. Create detailed issue reports

**Remember**: This website serves 5000+ students, so always prioritize stability, performance, and user experience in any changes or additions.
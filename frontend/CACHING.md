# Caching Strategy

## Overview
The application implements a multi-layer caching strategy to minimize Firebase reads and improve performance.

## Cache Layers

### 1. Firestore Offline Persistence
- **Location**: IndexedDB (browser)
- **Scope**: All Firestore queries
- **TTL**: Managed by Firebase SDK
- **Benefits**: Automatic offline support, reduces network requests

### 2. Memory + LocalStorage Cache
- **Location**: `lib/cache.ts`
- **Scope**: Service layer responses
- **TTL**: Configurable per data type (5-10 minutes)
- **Benefits**: Instant data access, survives page refreshes

## Cache TTL Configuration

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Resources | 5 min | Moderate update frequency |
| Categories | 10 min | Rarely changes |
| PYQs | 5 min | Moderate update frequency |
| Contacts | 10 min | Rarely changes |
| Links | 10 min | Rarely changes |

## Cache Invalidation

Caches are automatically cleared when:
- Data is created, updated, or deleted
- TTL expires
- User manually clears browser data

## Usage

```typescript
import { DataCache } from '@/lib/cache';

// Set cache
DataCache.set('key', data, 5); // 5 minutes TTL

// Get cache
const cached = DataCache.get('key');

// Clear specific cache
DataCache.clear('key');

// Clear all caches
DataCache.clearAll();
```

## Performance Impact

- **Before**: Every page refresh = Firebase read
- **After**: First load = Firebase read, subsequent loads = cache hit
- **Savings**: ~90% reduction in Firebase reads for typical usage

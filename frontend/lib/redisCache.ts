// Redis caching with Upstash fallback to in-memory
import { redis } from './redis';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private memCache = new Map<string, CacheItem<any>>();
  private useRedis = !!process.env.UPSTASH_REDIS_REST_URL;

  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    if (this.useRedis) {
      try {
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
        return;
      } catch (error) {
        console.warn('Redis set failed, using memory cache:', error);
      }
    }
    
    this.memCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.useRedis) {
      try {
        const data = await redis.get(key);
        return data ? JSON.parse(data as string) : null;
      } catch (error) {
        console.warn('Redis get failed, using memory cache:', error);
      }
    }
    
    const item = this.memCache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.memCache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  async delete(key: string): Promise<void> {
    if (this.useRedis) {
      try {
        await redis.del(key);
        return;
      } catch (error) {
        console.warn('Redis delete failed:', error);
      }
    }
    this.memCache.delete(key);
  }

  clear(): void {
    this.memCache.clear();
  }

  deletePattern(pattern: string): void {
    const keys = Array.from(this.memCache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.memCache.delete(key);
      }
    });
  }
}

export const cache = new CacheManager();

// Synchronous wrapper for client components
export const cacheSync = {
  set: <T>(key: string, data: T, ttl: number = 300) => cache.set(key, data, ttl),
  get: <T>(key: string) => cache.get<T>(key),
  delete: (key: string) => cache.delete(key),
};

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: (username: string) => `user:${username}`,
  USER_POSTS: (userId: string) => `posts:${userId}`,
  FEED: (page: number) => `feed:${page}`,
  POST: (postId: string) => `post:${postId}`,
  COMMENTS: (postId: string) => `comments:${postId}`,
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  USER_PROFILE: 900, // 15 minutes
  FEED: 300, // 5 minutes
  POST: 600, // 10 minutes
  COMMENTS: 300, // 5 minutes
};

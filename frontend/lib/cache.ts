// Simple cache utility with localStorage persistence and TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const CACHE_PREFIX = 'namdapha_cache_';

export class DataCache {
  private static memoryCache = new Map<string, CacheEntry<unknown>>();

  static set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    };
    
    this.memoryCache.set(key, entry);
    
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Ignore localStorage errors
    }
  }

  static get<T>(key: string): T | null {
    // Check memory cache first
    let entry = this.memoryCache.get(key);
    
    // If not in memory, check localStorage
    if (!entry) {
      try {
        const stored = localStorage.getItem(CACHE_PREFIX + key);
        if (stored) {
          entry = JSON.parse(stored);
          this.memoryCache.set(key, entry!);
        }
      } catch {
        return null;
      }
    }

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.clear(key);
      return null;
    }

    return entry.data as T;
  }

  static clear(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch {
      // Ignore
    }
  }

  static clearAll(): void {
    this.memoryCache.clear();
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  }
}

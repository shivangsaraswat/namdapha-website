import { useState, useEffect, useCallback } from 'react';

interface UseFirebaseDataOptions<T> {
  fetchFn: () => Promise<T>;
  deps?: unknown[];
  enabled?: boolean;
}

export function useFirebaseData<T>({ 
  fetchFn, 
  deps = [], 
  enabled = true 
}: UseFirebaseDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('Firebase fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, enabled]);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      if (!enabled || !mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('Firebase fetch error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fetchFn, ...deps]);

  return { data, loading, error, refetch };
}

"use client";

import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';

export function useActivityTracker() {
  const { data: session } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!session?.user) return;

    const userRole = (session.user as { role?: string }).role;
    
    // Skip activity tracking for super-admin
    if (userRole === 'super-admin') return;

    const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        signOut({ 
          callbackUrl: '/auth/signin?message=Session expired due to inactivity',
          redirect: true 
        });
      }, TIMEOUT_DURATION);
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timeout
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [session]);
}
"use client";

import { useEffect } from 'react';
import { preloadCriticalData } from '@/lib/preload';

export default function PreloadData() {
  useEffect(() => {
    preloadCriticalData();
  }, []);

  return null;
}

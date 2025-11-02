'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
}

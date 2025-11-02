'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on maintenance and whatsapp pages
  if (pathname === '/maintenance' || pathname === '/whatsapp' || pathname?.startsWith('/whatsapp')) {
    return null;
  }
  
  return <Footer />;
}

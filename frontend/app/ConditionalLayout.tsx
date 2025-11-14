"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import PageWrapper from './page-wrapper';
import PreloadData from '@/components/PreloadData';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCommunity = pathname?.startsWith('/community');

  if (isCommunity) {
    return <>{children}</>;
  }

  return (
    <>
      <PreloadData />
      <Navbar />
      <PageWrapper>
        {children}
        <ConditionalFooter />
      </PageWrapper>
    </>
  );
}

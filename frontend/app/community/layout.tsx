'use client';

import { usePathname } from 'next/navigation';
import CommunityNavbar from '@/components/community/CommunityNavbar';
import CommunityFooter from '@/components/community/CommunityFooter';
import { Toaster } from 'sonner';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname === '/community/signin' || pathname === '/community/onboarding';

  if (hideNavAndFooter) {
    return (
      <>
        {children}
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col pt-14">
      <CommunityNavbar />
      <main className="flex-1">{children}</main>
      <Toaster position="top-center" richColors />
    </div>
  );
}

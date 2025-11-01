'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMaintenanceStatus } from '@/lib/maintenanceService';

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Don't check if already on maintenance page
    if (pathname === '/maintenance') {
      setIsChecking(false);
      return;
    }

    const checkMaintenance = async () => {
      try {
        const status = await getMaintenanceStatus();
        
        // Check if maintenance is enabled
        if (status.isEnabled) {
          // In development, only show maintenance if testInDevelopment is true
          if (process.env.NODE_ENV === 'development' && !status.testInDevelopment) {
            setIsChecking(false);
            return;
          }
          
          // Redirect to maintenance page
          router.replace('/maintenance');
          return;
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenance();
    
    // Check every 30 seconds
    const interval = setInterval(checkMaintenance, 30000);
    return () => clearInterval(interval);
  }, [router, pathname]);

  // Show loading only when checking and not on maintenance page
  if (isChecking && pathname !== '/maintenance') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

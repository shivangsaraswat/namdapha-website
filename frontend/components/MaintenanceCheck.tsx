'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMaintenanceStatus } from '@/lib/maintenanceService';

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      // Skip maintenance check in development
      if (process.env.NODE_ENV === 'development') {
        setIsChecking(false);
        return;
      }

      try {
        const status = await getMaintenanceStatus();
        if (status.isEnabled) {
          router.push('/maintenance');
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenance();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}

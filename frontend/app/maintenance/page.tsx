'use client';

import { useEffect, useState } from 'react';
import { Construction, Clock, RefreshCw } from 'lucide-react';
import { getMaintenanceStatus } from '@/lib/maintenanceService';

export default function MaintenancePage() {
  const [message, setMessage] = useState('We are currently performing scheduled maintenance. Please check back soon.');
  const [estimatedEndTime, setEstimatedEndTime] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const loadMaintenanceInfo = async () => {
      try {
        const status = await getMaintenanceStatus();
        if (status.message) setMessage(status.message);
        if (status.estimatedEndTime) setEstimatedEndTime(status.estimatedEndTime);
      } catch (error) {
        console.error('Error loading maintenance info:', error);
      }
    };

    loadMaintenanceInfo();
  }, []);

  const handleRefresh = async () => {
    setChecking(true);
    try {
      const status = await getMaintenanceStatus();
      if (!status.isEnabled) {
        window.location.href = '/';
      } else {
        setTimeout(() => setChecking(false), 1000);
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse"></div>
            <Construction className="w-24 h-24 text-yellow-500 relative animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Under Maintenance
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          {message}
        </p>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <Clock className="w-5 h-5" />
            <span>
              {estimatedEndTime 
                ? `Expected back: ${new Date(estimatedEndTime).toLocaleString()}`
                : "We'll be back shortly"}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-600 disabled:opacity-50 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking...' : 'Check Again'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          If you need immediate assistance, please contact us at{' '}
          <a href="mailto:namdapha-webad@ds.study.iitm.ac.in" className="text-yellow-500 hover:underline">
            namdapha-webad@ds.study.iitm.ac.in
          </a>
        </p>
      </div>
    </div>
  );
}

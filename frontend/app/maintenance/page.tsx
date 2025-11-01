import Link from 'next/link';
import { Construction, Clock, Home } from 'lucide-react';

export default function MaintenancePage() {
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
          We are currently performing scheduled maintenance. Please check back soon.
        </p>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <Clock className="w-5 h-5" />
            <span>We&apos;ll be back shortly</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Try Again
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          If you need immediate assistance, please contact us at{' '}
          <a href="mailto:support@namdapha.com" className="text-yellow-500 hover:underline">
            support@namdapha.com
          </a>
        </p>
      </div>
    </div>
  );
}

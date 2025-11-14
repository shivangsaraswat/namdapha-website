"use client";

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { dancingScript } from '@/app/fonts';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-namdapha.png" alt="Namdapha House" width={32} height={32} className="object-contain" priority />
            <span className={`text-lg text-black ${dancingScript.className}`}>Namdapha House</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
            <h1 className="text-3xl font-normal text-[#121317] mb-8">Sign in</h1>

            <button
              onClick={() => signIn('google', { callbackUrl: '/community' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-[#E5E7EB] hover:border-[#D1D5DB] rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-[#374151]">Continue with Google</span>
            </button>

            <p className="text-xs text-[#6B7280] text-center mt-6">
              By clicking Continue, you agree to Namdapha's{' '}
              <Link href="#" className="text-[#4F46E5] hover:underline">User Agreement</Link>,{' '}
              <Link href="#" className="text-[#4F46E5] hover:underline">Privacy Policy</Link>, and{' '}
              <Link href="#" className="text-[#4F46E5] hover:underline">Cookie Policy</Link>.
            </p>
          </div>

          <p className="text-center text-sm text-[#374151] mt-6">
            New to Namdapha?{' '}
            <button
              onClick={() => signIn('google', { callbackUrl: '/community' })}
              className="text-[#4F46E5] font-semibold hover:underline"
            >
              Join now
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#6B7280]">
            <span>© {new Date().getFullYear()} Namdapha House</span>
            <Link href="#" className="hover:text-[#121317]">User Agreement</Link>
            <Link href="#" className="hover:text-[#121317]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#121317]">Community Guidelines</Link>
            <Link href="#" className="hover:text-[#121317]">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

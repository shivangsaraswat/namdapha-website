"use client";

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    // Don't show loading for same-page anchor links
    if (href.startsWith('/#')) {
      const id = href.substring(2); // Remove '/#'
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <header className="relative z-50 w-full px-6 py-5 md:px-8 lg:px-12 text-white">
      <nav className="flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/" className="font-medium text-lg lg:text-xl tracking-tight bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Namdapha House</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
          <button onClick={() => handleNavigation('/#about')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1">
            About us
          </button>

          <button onClick={() => handleNavigation('/council')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1">
            Council
          </button>

          <button onClick={() => handleNavigation('/teams')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1">
            Teams
          </button>

          <button onClick={() => handleNavigation('/events')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1">
            Events
          </button>

          <button onClick={() => handleNavigation('/resources')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1">
            Resource Hub
          </button>
        </div>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center space-x-4">
          <button onClick={() => handleNavigation('/whatsapp')} className="hidden lg:inline-flex items-center justify-center outline-none relative tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-10 text-15 px-6 rounded-full md:h-9 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] font-semibold transition-colors duration-300 group">
            <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
            <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
            <span className="absolute inset-0 rounded-full bg-black"></span>
            <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
            <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
            <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent">
              Join WhatsApp
            </span>
          </button>
          
          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-95 transition-opacity duration-300 z-[9999] ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col h-full text-white">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <Link href="/" className="font-medium text-lg tracking-tight bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">
              Namdapha House
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 px-6 py-8">
            <div className="space-y-8">
              <button
                onClick={() => { setIsMenuOpen(false); handleNavigation('/#about'); }}
                className="block text-white hover:opacity-90 transition-colors text-lg py-2 w-full text-left"
              >
                About us
              </button>

              <button
                onClick={() => { setIsMenuOpen(false); handleNavigation('/council'); }}
                className="block text-white hover:opacity-90 transition-colors text-lg py-2 w-full text-left"
              >
                Council
              </button>

              <button
                onClick={() => { setIsMenuOpen(false); handleNavigation('/teams'); }}
                className="block text-white hover:opacity-90 transition-colors text-lg py-2 w-full text-left"
              >
                Teams
              </button>

              <button
                onClick={() => { setIsMenuOpen(false); handleNavigation('/events'); }}
                className="block text-white hover:opacity-90 transition-colors text-lg py-2 w-full text-left"
              >
                Events
              </button>

              <button
                onClick={() => { setIsMenuOpen(false); handleNavigation('/resources'); }}
                className="block text-white hover:opacity-90 transition-colors text-lg py-2 w-full text-left"
              >
                Resource Hub
              </button>

              <div className="pt-6">
                <button
                  onClick={() => { setIsMenuOpen(false); handleNavigation('/whatsapp'); }}
                  className="block bg-white text-black px-4 py-3 rounded-lg font-medium text-center w-full"
                >
                  Join WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPending && <LoadingSpinner />}
    </header>
  );
}

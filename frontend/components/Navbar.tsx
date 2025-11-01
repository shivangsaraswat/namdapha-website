"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full px-6 py-5 md:px-8 lg:px-12 text-white">
      <nav className="flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/" className="font-bold text-lg lg:text-xl tracking-tight text-white">Namdapha House</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-7">
          <Link href="/about" className="flex items-center space-x-1 text-white hover:opacity-90 transition-colors text-base">
            <span>About us</span>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>

          <Link href="/council" className="text-white hover:opacity-90 transition-colors text-base">
            Council
          </Link>

          <Link href="/teams" className="flex items-center space-x-1 text-white hover:opacity-90 transition-colors text-base">
            <span>Teams</span>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>

          <Link href="/events" className="text-white hover:opacity-90 transition-colors text-base">
            Events
          </Link>

          <Link href="/resources" className="flex items-center space-x-1 text-white hover:opacity-90 transition-colors text-base">
            <span>Resource Hub</span>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center space-x-4">
          <Link href="/whatsapp" className="hidden lg:block bg-[rgb(255,255,255)] text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
            Join WhatsApp
          </Link>
          
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
            <Link href="/" className="font-bold text-lg tracking-tight text-white">
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
              <Link
                href="/about"
                className="block text-white hover:opacity-90 transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About us
              </Link>

              <Link
                href="/council"
                className="block text-white hover:opacity-90 transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Council
              </Link>

              <Link
                href="/teams"
                className="block text-white hover:opacity-90 transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Teams
              </Link>

              <Link
                href="/events"
                className="block text-white hover:opacity-90 transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>

              <Link
                href="/resources"
                className="block text-white hover:opacity-90 transition-colors text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Resource Hub
              </Link>

              <div className="pt-6">
                <Link
                  href="/whatsapp"
                  className="block bg-white text-black px-4 py-3 rounded-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

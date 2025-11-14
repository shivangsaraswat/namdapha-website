"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide navbar based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      }
      
      // Background appearance
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (href: string) => {
    // Handle same-page anchor links
    if (href.startsWith('/#')) {
      if (pathname === '/') {
        const id = href.substring(2);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      } else {
        router.push(href);
        return;
      }
    }
    
    router.push(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[9999] w-full px-6 py-5 md:px-8 lg:px-12 text-white transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } max-md:[body[data-dialog-open]_&]:hidden`}>
      <nav className={`flex items-center justify-between mx-auto relative transition-all duration-300 ${
        isScrolled ? 'max-w-[900px] lg:max-w-[1000px]' : 'max-w-[1200px]'
      }`}>
        {/* Glassmorphism Background */}
        <div 
          className={`absolute -left-4 -right-4 -top-2 -bottom-2 rounded-[2rem] transition-all duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            zIndex: -1,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
        
        <div className={`flex items-center relative z-10 transition-all duration-300 ${
          isScrolled ? 'space-x-2' : 'space-x-3'
        }`}>
          <Link href="/" className="font-medium text-lg lg:text-xl tracking-tight bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Namdapha House</Link>
        </div>

        {/* Desktop Navigation */}
        <div className={`hidden lg:flex items-center rounded-full px-4 py-2 relative z-10 transition-all duration-300 ${
          isScrolled ? 'border border-white/20 space-x-1' : 'border border-transparent space-x-3'
        }`} style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)'
        }}>
          <button onClick={() => handleNavigation('/#about')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1 cursor-pointer">
            About us
          </button>

          <button onClick={() => handleNavigation('/council')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1 cursor-pointer">
            Council
          </button>

          <button onClick={() => handleNavigation('/teams')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1 cursor-pointer">
            Teams
          </button>

          <button onClick={() => handleNavigation('/events')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1 cursor-pointer">
            Events
          </button>

          <button onClick={() => handleNavigation('/resources')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1 cursor-pointer">
            Resource Hub
          </button>

          <button onClick={() => handleNavigation('/community')} className="text-white hover:opacity-90 transition-colors text-base px-3 py-1 cursor-pointer">
            Community
          </button>
        </div>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className={`flex items-center relative z-10 transition-all duration-300 ${
          isScrolled ? 'space-x-2' : 'space-x-4'
        }`}>
          <button onClick={() => handleNavigation('/whatsapp')} className={`hidden lg:inline-flex items-center justify-center outline-none relative tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-10 text-15 rounded-full md:h-9 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] font-semibold transition-all duration-300 group cursor-pointer ${
            isScrolled ? 'px-4' : 'px-6'
          }`}>
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
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999] h-screen" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="fixed top-0 right-0 h-screen w-[85vw] max-w-[320px] bg-[#0A0A0B] shadow-2xl transform transition-transform duration-300 z-[99999]" onClick={(e) => e.stopPropagation()}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </div>
            
            <div className="relative flex flex-col h-screen text-white overflow-hidden">
              {/* Mobile Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-6 border-b border-white/10">
                <span className="font-medium text-lg tracking-tight bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">
                  Namdapha House
                </span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="space-y-6">
                  <button
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/#about'); }}
                    className="block text-white/90 hover:text-white transition-colors text-lg py-2 w-full text-left"
                  >
                    About us
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/council'); }}
                    className="block text-white/90 hover:text-white transition-colors text-lg py-2 w-full text-left"
                  >
                    Council
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/teams'); }}
                    className="block text-white/90 hover:text-white transition-colors text-lg py-2 w-full text-left"
                  >
                    Teams
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/events'); }}
                    className="block text-white/90 hover:text-white transition-colors text-lg py-2 w-full text-left"
                  >
                    Events
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/resources'); }}
                    className="block text-white/90 hover:text-white transition-colors text-lg py-2 w-full text-left"
                  >
                    Resource Hub
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); handleNavigation('/community'); }}
                    className="block text-white/90 hover:text-white transition-colors text-lg py-2 w-full text-left"
                  >
                    Community
                  </button>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex-shrink-0 px-6 py-6 border-t border-white/10">
                <button
                  onClick={() => { setIsMenuOpen(false); handleNavigation('/whatsapp'); }}
                  className="inline-flex items-center justify-center outline-none relative tracking-tight leading-none h-10 text-15 px-6 rounded-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] font-semibold transition-colors duration-300 group w-full"
                >
                  <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
                  <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
                  <span className="absolute inset-0 rounded-full bg-black"></span>
                  <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
                  <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
                  <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent">
                    Join WhatsApp
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

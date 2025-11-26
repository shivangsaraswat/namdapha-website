import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaYoutube, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const EventFooter = () => {
  return (
    <div className="relative" data-events-footer>
      {/* Footer Content */}
      <footer className="relative bg-[#0A0A0B] text-white py-12 border-t border-gray-800 overflow-hidden" data-events-footer>
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/councilbg.svg"
            alt="Footer background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-12">
          {/* Main Content Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
            {/* Logo Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo-namdapha.png"
                  alt="Namdapha Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-2xl font-medium bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent tracking-tight">Namdapha House</span>
              </div>
              {/* Social Icons */}
              <div className="flex items-center justify-center space-x-4">
                <a href="#" aria-label="X" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
                  <FaGithub className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Navigation Sections - Responsive Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:gap-8 gap-8">
              {/* Visit */}
              <div>
                <h3 className="text-white font-medium mb-4">Visit</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/link-tree" className="hover:text-white transition-colors">
                      LinkTree
                    </Link>
                  </li>
                  <li>
                    <Link href="/verify-certificate" className="hover:text-white transition-colors">
                      Certificate Verification
                    </Link>
                  </li>
                  <li>
                    <Link href="/whatsapp" className="hover:text-white transition-colors">
                      Join WhatsApp Groups
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Pages */}
              <div>
                <h3 className="text-white font-medium mb-4">Pages</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/council" className="hover:text-white transition-colors">
                      Council
                    </Link>
                  </li>
                  <li>
                    <Link href="/teams" className="hover:text-white transition-colors">
                      Teams
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-white transition-colors">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="hover:text-white transition-colors">
                      Resource Hub
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-white font-medium mb-4">Tools</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="resources/grade-predictor" className="hover:text-white transition-colors">
                      Grade Predictor
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Grade Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              {/* About Us */}
              <div>
                <h3 className="text-white font-medium mb-4">About Us</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Explore Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center pt-8 border-t border-gray-800 gap-4">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-400">
              <span className="text-center md:text-left">Copyright © {new Date().getFullYear()} Namdapha House. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="text-center md:text-left">Build & Maintained by Web-Ops Team Namdapha</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventFooter;

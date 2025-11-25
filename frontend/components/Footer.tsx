import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaYoutube, FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0B] text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/footorbg.svg"
          alt="Footer background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* CTA Section */}
      <section className="relative z-10 py-8 md:py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto text-center">

          {/* Title + Subtitle + CTA */}
          <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.75rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.1] tracking-tight mb-4">
              Join Namdapha House<br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#c8f0d0] to-[#25D366]">
                WhatsApp
              </span>
              {' '}Community
            </h1>

            <p className="text-gray-300 text-lg md:text-lg leading-relaxed">
              Get updates, ask questions, and connect with members in our active WhatsApp community.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/whatsapp" className="inline-flex items-center bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3 rounded-lg font-medium transition-colors text-base">
                <FaWhatsapp className="w-5 h-5 mr-2" />
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="relative z-10 border-t border-gray-800 py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo and Social */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">

                <span className="text-white font-semibold text-lg">Namdapha House</span>
              </div>

              {/* Social Icons */}
              <div className="flex space-x-4">
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

            {/* Visit */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">Visit</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/link-tree" className="text-gray-400 hover:text-white transition-colors text-sm">
                    LinkTree
                  </Link>
                </li>
                <li>
                  <Link href="/verify-certificate" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Certificate Verification
                  </Link>
                </li>
                <li>
                  <Link href="/whatsapp" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Join WhatsApp Groups
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">Pages</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/council" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Council
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Teams
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="resources" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Resource Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">Tools</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Grade Predictor
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Grade Calculator
                  </Link>
                </li>

              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold text-base mb-4">About Us</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Explore Gallery
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/credits" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Credits
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              Copyright © {new Date().getFullYear()} Namdapha House. All rights reserved.
            </p>
            <div className="flex space-x-6">

              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                Build & Maintained by Web-Ops Team Namdapha
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

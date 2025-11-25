"use client";

import Link from "next/link";

export default function CreditsFooter() {
    return (
        <footer className="relative z-10 py-8 border-t border-[#D4AF37]/10 bg-[#050505]">
            <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light tracking-widest text-gray-600 uppercase">
                <p>© {new Date().getFullYear()} Namdapha House</p>

                <div className="flex items-center gap-8">
                    <Link href="/" className="hover:text-[#D4AF37] transition-colors duration-300">Home</Link>
                    <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors duration-300">Privacy</Link>
                    <Link href="/terms" className="hover:text-[#D4AF37] transition-colors duration-300">Terms</Link>
                </div>

                <p className="opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-default">Web Ops</p>
            </div>
        </footer>
    );
}

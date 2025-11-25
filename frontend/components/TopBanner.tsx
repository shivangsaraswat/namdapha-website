"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function TopBanner() {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 'auto', opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative z-40 bg-gradient-to-r from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A] border-b border-[#D4AF37]/20 text-white overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
                        <div className="flex-1 text-center">
                            <p className="text-xs md:text-sm font-light tracking-wide">
                                <span className="text-gray-400">Curious about the minds behind this platform? </span>
                                <Link
                                    href="/credits"
                                    className="inline-flex items-center gap-1 font-medium text-[#D4AF37] hover:text-white transition-colors ml-1 group"
                                >
                                    Meet the Creators
                                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-[#D4AF37]"></span>
                                    <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </p>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 focus:outline-none absolute right-4 md:relative md:right-auto"
                            aria-label="Close banner"
                        >
                            <HiX className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

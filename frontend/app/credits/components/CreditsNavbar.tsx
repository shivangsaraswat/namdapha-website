"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";

export default function CreditsNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-6 left-0 right-0 z-50 flex flex-col items-center pointer-events-none"
        >
            <div className="pointer-events-auto bg-[#0A0A0A]/80 backdrop-blur-md border border-[#D4AF37]/20 shadow-2xl rounded-full px-6 md:px-8 py-3 flex items-center gap-4 md:gap-8 transition-all hover:border-[#D4AF37]/40 hover:bg-[#0A0A0A]/90 hover:shadow-[#D4AF37]/5 relative z-50">
                <Link href="/" className="relative w-8 h-8 hover:opacity-80 transition-opacity group flex-shrink-0">
                    <div className="absolute inset-0 bg-[#D4AF37]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image src="/logo-namdapha.png" alt="Logo" fill className="object-contain relative z-10" />
                </Link>

                <div className="h-4 w-[1px] bg-[#D4AF37]/20" />

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {['Resource Hub', 'Council', 'Teams', 'Events'].map((item) => (
                        <Link
                            key={item}
                            href={item === 'Resource Hub' ? '/resources' : `/${item.toLowerCase()}`}
                            className="text-sm font-light text-gray-400 hover:text-[#D4AF37] transition-colors tracking-wide relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-[#D4AF37] hover:text-white transition-colors focus:outline-none"
                >
                    {isOpen ? <HiX size={24} /> : <HiMenuAlt4 size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto absolute top-full mt-4 w-[90%] max-w-[300px] bg-[#0A0A0A]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col py-4"
                    >
                        {['Resource Hub', 'Council', 'Teams', 'Events'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Resource Hub' ? '/resources' : `/${item.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-3 text-sm font-light text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all tracking-wide text-center"
                            >
                                {item}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

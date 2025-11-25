"use client";

import Image from "next/image";
import { motion } from "framer-motion";


export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">

            {/* Royal Background (No Stars/Fog) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Watermark Logo */}
                <div className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[90vh] h-[90vh] opacity-[0.06] pointer-events-none select-none mix-blend-screen">
                    <Image
                        src="/logo-namdapha.png"
                        alt="Namdapha Watermark"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Subtle Gold Spotlight */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-[100px]" />

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                {/* Elegant Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Content */}
            <main className="relative z-10 px-6 pb-20 pt-32 max-w-[800px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        Terms of Service
                    </h1>

                    <div className="space-y-12 text-gray-300 font-light leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using the Namdapha House website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">2. Use License</h2>
                            <p className="mb-4">
                                Permission is granted to temporarily download one copy of the materials (information or software) on Namdapha House&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#D4AF37]">
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>Attempt to decompile or reverse engineer any software contained on Namdapha House&apos;s website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">3. Intellectual Property Rights</h2>
                            <div className="bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] p-6 rounded-r-lg">
                                <p className="text-white font-medium">
                                    <strong>Unauthorized Use Warning:</strong> All images, photographs, and visual content displayed on this website are the exclusive property of Namdapha House and its contributors. Unauthorized copying, downloading, screenshots, or any form of reproduction or distribution of these images is strictly prohibited and constitutes a violation of our Terms of Service and applicable intellectual property laws.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">4. Disclaimer</h2>
                            <p>
                                The materials on Namdapha House&apos;s website are provided &quot;as is&quot;. Namdapha House makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">5. Limitations</h2>
                            <p>
                                In no event shall Namdapha House or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Namdapha House&apos;s website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">6. Governing Law</h2>
                            <p>
                                Any claim relating to Namdapha House&apos;s website shall be governed by the laws of the State without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <div className="pt-8 text-sm text-gray-500 border-t border-white/10">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </motion.div>
            </main>


        </div>
    );
}

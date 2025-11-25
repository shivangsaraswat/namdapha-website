"use client";

import Image from "next/image";
import { motion } from "framer-motion";


export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>

                    <div className="space-y-12 text-gray-300 font-light leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">1. Introduction</h2>
                            <p>
                                Welcome to the Namdapha House website. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">2. Intellectual Property & Image Usage</h2>
                            <p className="mb-4">
                                All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of Namdapha House or its content suppliers and is protected by international copyright laws.
                            </p>
                            <div className="bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] p-6 rounded-r-lg">
                                <p className="text-white font-medium">
                                    <strong>Strict Prohibition:</strong> The unauthorized use, reproduction, distribution, display, or transmission of any images, photographs, or visual assets hosted on this platform is strictly prohibited. Any unauthorized use of these materials may violate copyright laws, trademark laws, the laws of privacy and publicity, and communications regulations and statutes.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">3. Data Collection</h2>
                            <p>
                                We may collect limited non-personal identification information about users whenever they interact with our site. This may include the browser name, the type of computer, and technical information about users&apos; means of connection to our site, such as the operating system and the Internet service providers utilized.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">4. Use of Information</h2>
                            <p>
                                Any information we collect is used solely for the purpose of improving user experience and maintaining the technical performance of the website. We do not sell, trade, or rent users&apos; personal identification information to others.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">5. Changes to This Policy</h2>
                            <p>
                                Namdapha House has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[#D4AF37] mb-4 uppercase tracking-wider">6. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact the Web Operations Team.
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


"use client";

import Image from "next/image";
import { CONTRIBUTORS, Contributor } from "@/lib/creditsData";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CreditsNavbar from "./components/CreditsNavbar";
import CreditsFooter from "./components/CreditsFooter";
import { useRef, useEffect, useState } from "react";

export default function CreditsPage() {
    const containerRef = useRef(null);
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; moveX: number; moveY: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 10 + 5,
            delay: Math.random() * 5,
            moveX: Math.random() * 100 - 50,
            moveY: Math.random() * 100 - 50,
        }));
        setStars(newStars);

        // Auto-scroll to Web Operations Team after 1 second ONLY if at the top
        const timer = setTimeout(() => {
            if (window.scrollY < 50) {
                const webOpsSection = document.getElementById('web-ops-header');
                if (webOpsSection) {
                    webOpsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
            <CreditsNavbar />

            {/* Royal Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Fog Effect */}
                <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden">
                    <motion.div
                        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_50%)] blur-[100px]"
                        animate={{ transform: ["translate(0,0)", "translate(10%, 10%)", "translate(-5%, 5%)", "translate(0,0)"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute top-[20%] left-[20%] w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_60%)] blur-[120px]"
                        animate={{ transform: ["translate(0,0)", "translate(-10%, -5%)", "translate(5%, -10%)", "translate(0,0)"] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Sparkling Stars */}
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute bg-white rounded-full mix-blend-screen"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: [0, star.moveX],
                            y: [0, star.moveY],
                            scale: [0.5, 1.2, 0.5]
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: star.delay
                        }}
                    />
                ))}
                {/* Watermark Logo */}
                <div className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[90vh] h-[90vh] opacity-[0.06] pointer-events-none select-none mix-blend-screen">
                    <Image
                        src="/logo-namdapha.png"
                        alt="Namdapha Watermark"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                {/* Elegant Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Compact Hero Section */}
            <section className="relative z-10 min-h-[40vh] flex flex-col items-center justify-center px-6 pt-32 pb-10">
                <div className="max-w-[1000px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <h1
                            className="text-[4rem] sm:text-[6rem] md:text-[7rem] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#fff] via-[#e0e0e0] to-[#666] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] relative pr-8"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            THE CREATORS
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Contributors List */}
            <main className="relative z-10 pb-32 space-y-12">
                {CONTRIBUTORS.map((contributor, index) => {
                    const showTeamHeader = index === 0 || contributor.team !== CONTRIBUTORS[index - 1].team;
                    return (
                        <div key={contributor.id}>
                            {showTeamHeader && (
                                <TeamHeader
                                    team={contributor.team}
                                    id={contributor.team === "Web Operations Team" ? "web-ops-header" : undefined}
                                />
                            )}
                            <ContributorCard contributor={contributor} index={index} />
                        </div>
                    );
                })}
            </main>

            <CreditsFooter />
        </div>
    );
}

function TeamHeader({ team, id }: { team: string, id?: string }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 30, restDelta: 0.001 });

    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.92, 1, 1, 0.92]);
    const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);
    const blur = useTransform(smoothProgress, [0, 0.25, 0.75, 1], ["8px", "0px", "0px", "8px"]);

    return (
        <motion.div
            ref={ref}
            id={id}
            style={{ opacity, scale, y, filter: `blur(${blur})` }}
            className="relative py-24 md:py-32 text-center scroll-mt-24"
        >
            <h2
                className="text-[3rem] sm:text-[4rem] md:text-[6rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none select-none pointer-events-none px-4"
                style={{
                    fontFamily: 'var(--font-londrina-outline)',
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)',
                }}
            >
                {team.replace(" Team", "").toUpperCase()}
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
                <h3 className="text-xl md:text-3xl font-bold text-[#D4AF37] tracking-widest uppercase" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {team}
                </h3>
            </div>
        </motion.div>
    );
}

function ContributorCard({ contributor, index }: { contributor: Contributor, index: number }) {
    const isEven = index % 2 === 0;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 30, restDelta: 0.001 });

    const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
    const y = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [50, 0, 0, -50]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity, scale, y }}
            className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 flex items-center justify-center min-h-[60vh]"
        >
            <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32 items-center w-full ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                {/* Image Section */}
                <div className={`relative group ${isEven ? 'lg:col-start-1' : 'lg:col-start-2'}`}>
                    <div className="relative aspect-[3/4] w-full max-w-[350px] lg:max-w-[380px] xl:max-w-[450px] mx-auto overflow-hidden rounded-sm bg-[#111]">
                        <Image
                            src={contributor.imageUrl}
                            alt={contributor.name}
                            fill
                            className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 group-active:grayscale-0"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    {/* Decorative Frame Elements */}
                    <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37]/40" />
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/40" />
                </div>

                {/* Content Section */}
                <div className={`space-y-8 text-left ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'}`}>
                    <div className="space-y-3">
                        <div className={`flex items-center gap-4 ${isEven ? 'justify-start' : 'justify-start flex-row-reverse'}`}>
                            <span className="h-[1px] w-16 bg-[#D4AF37]"></span>
                            <h3 className="text-[#D4AF37] text-sm font-bold tracking-[0.25em] uppercase">
                                {contributor.role}
                            </h3>
                        </div>
                        <h2
                            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight whitespace-nowrap"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            {contributor.name}
                        </h2>
                    </div>

                    <p className="text-gray-400 text-base md:text-lg xl:text-xl leading-relaxed max-w-xl font-light text-left">
                        {contributor.description}
                    </p>

                </div>
            </div>
        </motion.section>
    );
}

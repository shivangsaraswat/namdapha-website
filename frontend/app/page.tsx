'use client';

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LightningBackground from "@/components/LightningBackground";
import DesignGallery from "@/components/DesignGallery";
import SuccessStories from "@/components/SuccessStories";
import Activites from "@/components/Activites";
import ImageGallery from "@/components/ImageGallery";
import EventCarousel from "@/components/EventCarousel";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Page() {
  const aboutRef = useRef(null);
  const whatWeDoRef = useRef(null);
  const eventsRef = useRef(null);
  const storiesRef = useRef(null);
  const galleryRef = useRef(null);
  
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const whatWeDoInView = useInView(whatWeDoRef, { once: true, margin: "-100px" });
  const eventsInView = useInView(eventsRef, { once: true, margin: "-100px" });
  const storiesInView = useInView(storiesRef, { once: true, margin: "-100px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Namdapha House',
    url: 'https://namdapha.iitmbs.org',
    logo: 'https://namdapha.iitmbs.org/logo-namdapha.png',
    description: 'Namdapha House | General Student Body | IIT Madras',
    sameAs: [
      'https://github.com/namdaphahouse',
      'https://twitter.com/namdaphahouse',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      {/* Background SVG - positioned exactly like reference */}
      <div className="absolute left-1/2 top-0 w-[2842px] max-w-none -translate-x-1/2">
        <Image
          src="/bg.svg"
          alt="Background pattern"
          width={2842}
          height={1132}
          className="w-[2842px] max-w-none"
          priority
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 flex items-center min-h-[60vh] px-6 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center pt-4 md:pt-12 pb-20">
          {/* Left Content */}
          <motion.div className="space-y-6 pt-0" initial="hidden" animate="visible" variants={staggerContainer}>
            {/* Hero Title */}
            <motion.div className="space-y-1 mt-6" variants={fadeInUp}>
              <h1 className="text-4xl sm:text-[3rem] md:text-[3.5rem] lg:text-6xl xl:text-[4rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.1] tracking-tight">
                Legacy. <br></br>Leadership. <br />Limitless.
              </h1>
            </motion.div>

            {/* Hero Subtitle */}
            <motion.p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-[480px] leading-relaxed font-normal" variants={fadeInUp}>
              A vibrant house built on tradition, values, and excellence. Namdapha stands as a beacon of pride within the IIT Madras BS community.
            </motion.p>
          </motion.div>
          {/* Right Content - 3D Visual */}
          <motion.div className="relative flex items-center justify-center lg:justify-end" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="relative w-full h-[300px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
              {/* Background glow effects */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/10 to-blue-500/10 rounded-full blur-2xl"></div> */}

              {/* 3D Object representation - Simplified */}
              <div className="relative z-10 mx-auto w-full h-96 md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">

                {/* Lightning background */}
                <LightningBackground />

                {/* Logo */}
                <div className="absolute inset-4 flex items-center justify-center z-10">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/logo-namdapha.png"
                      alt="NAMP Logo"
                      width={560}
                      height={560}
                      className="object-contain rounded-full"
                      priority
                    />
                  </div>
                </div>
              </div>


            </div>
          </motion.div>
        </div>
      </main>

      <section id="about" ref={aboutRef} className="relative bg-[rgb(228,229,231)] overflow-hidden py-16 md:py-24 scroll-mt-20">
        {/* Decorative patterns container - positioned like council page */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Left pattern - positioned similar to council page */}
          <div className="hidden lg:block absolute left-0 top-[45%] -translate-y-1/2 opacity-90 transform -translate-x-[30px] scale-105 pointer-events-none z-0">
            <Image
              src="/bg2.svg"
              alt="Pattern left"
              width={358}
              height={1702}
              className="w-[358px] h-auto object-contain"
              priority
            />
          </div>

          {/* Right pattern (mirrored) - positioned similar to council page */}
          <div className="hidden lg:block absolute right-0 top-[80%] -translate-y-1/2 opacity-90 transform translate-x-[30px] scale-105 pointer-events-none z-0">
            <Image
              src="/bg2.svg"
              alt="Pattern right"
              width={358}
              height={1702}
              className="w-[358px] h-auto object-contain transform scale-x-[-1]"
              priority
            />
          </div>
        </div>


        {/* Main content - follow council page structure */}
        <div className="relative z-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="relative mb-12">
                {/* Centered content wrapper - like council page */}
                <motion.div className="max-w-4xl mx-auto text-center px-4" initial="hidden" animate={aboutInView ? "visible" : "hidden"} variants={staggerContainer}>
                  <motion.h2 className="fs-48 text-center font-title font-medium text-gray-8" variants={fadeInUp}>Who we are !</motion.h2>

                  <motion.p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16" variants={fadeInUp}>Namdapha House is a dynamic student community at IIT Madras BS Degree that thrives on unity, growth, and excellence. More than a house, it is a community where students find support in academics, opportunities in co-curriculars, and encouragement in extra-curriculars.</motion.p>

                  {/* Stats Grid - centered layout */}
                  <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mt-8 max-w-2xl mx-auto" initial="hidden" animate={aboutInView ? "visible" : "hidden"} variants={staggerContainer}>
                    <motion.div className="text-center space-y-2" variants={scaleIn}>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">5000+</div>
                      <div className="text-xs md:text-sm text-gray-600">Active Members</div>
                    </motion.div>
                    <motion.div className="text-center space-y-2" variants={scaleIn}>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">50+</div>
                      <div className="text-xs md:text-sm text-gray-600">Events Annually</div>
                    </motion.div>
                    <motion.div className="text-center space-y-2" variants={scaleIn}>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">11</div>
                      <div className="text-xs md:text-sm text-gray-600">Activity Communities</div>
                    </motion.div>
                    <motion.div className="text-center space-y-2" variants={scaleIn}>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">24/7</div>
                      <div className="text-xs md:text-sm text-gray-600">Community Support</div>
                    </motion.div>
                  </motion.div>

                  {/* Gallery - centered below stats */}
                  <motion.div className="flex items-center justify-center mt-12" variants={fadeInUp}>
                    <div className="w-[300px] md:w-[340px] lg:w-[380px]">
                      <DesignGallery />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* What We Do section */}
            <div ref={whatWeDoRef} className="mb-16">
              <div className="relative mb-12">
                <motion.div className="max-w-5xl mx-auto px-4" initial="hidden" animate={whatWeDoInView ? "visible" : "hidden"} variants={staggerContainer}>
                  <motion.h2 className="fs-48 text-center font-title font-medium text-gray-8 mb-6" variants={fadeInUp}>What We Do</motion.h2>
                  <motion.p className="mx-auto max-w-[720px] text-center text-16 md:text-18 leading-relaxed text-gray-30" variants={fadeInUp}>From academics to activities, Namdapha offers a holistic experience that nurtures talent, builds character, and creates lasting memories.</motion.p>

                  {/* Feature Grid */}
                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12" variants={staggerContainer}>
                    <motion.div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" variants={scaleIn} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Support</h3>
                      <p className="text-sm text-gray-600">Study groups, peer tutoring, and resource sharing to help everyone excel academically.</p>
                    </motion.div>

                    <motion.div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" variants={scaleIn} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Events & Workshops</h3>
                      <p className="text-sm text-gray-600">Tech talks, cultural fests, and skill-building workshops throughout the year.</p>
                    </motion.div>

                    <motion.div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" variants={scaleIn} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Building</h3>
                      <p className="text-sm text-gray-600">Regular meetups, team activities, and social events to strengthen bonds.</p>
                    </motion.div>

                    <motion.div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" variants={scaleIn} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation Hub</h3>
                      <p className="text-sm text-gray-600">Hackathons, project collaborations, and tech competitions to fuel creativity.</p>
                    </motion.div>

                    <motion.div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" variants={scaleIn} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sports & Recreation</h3>
                      <p className="text-sm text-gray-600">Gaming tournaments, fitness challenges, and recreational activities for all.</p>
                    </motion.div>

                    <motion.div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" variants={scaleIn} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Leadership Development</h3>
                      <p className="text-sm text-gray-600">Opportunities to lead teams, organize events, and develop management skills.</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Activites />

      <section ref={eventsRef} className="z-10 relative text-white bg-black py-16 px-6 md:px-8 lg:px-12">
        {/* Sparkling Stars */}
        <div className='absolute inset-0 pointer-events-none'>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-white rounded-full animate-twinkle'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <motion.div className="max-w-7xl mx-auto" initial="hidden" animate={eventsInView ? "visible" : "hidden"} variants={staggerContainer}>
          {/* Heading Section */}
          <div className="text-center mb-12">
            <motion.h2 className="text-4xl md:text-5xl xl:text-6xl font-title font-medium bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent mb-6" variants={fadeInUp}>Namdapha Events</motion.h2>
            <motion.p className="text-sm lg:text-base font-light text-gray-300 text-pretty max-w-3xl mx-auto mb-8" variants={fadeInUp}>At Namdapha, events are the heartbeat of our community. From tech, cultural, and sports fests to expert sessions and hands-on workshops, we create spaces that spark creativity and connection. Each event brings students together, encouraging collaboration, learning, and personal growth within the vibrant spirit of Namdapha.</motion.p>
          </div>

          {/* Events Content */}
          <motion.div className="flex flex-col items-center" variants={fadeInUp}>
            <h3 className="text-3xl font-title font-medium mb-8 bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent text-center">Upcoming Events</h3>
            <EventCarousel />
            <Link href="/events" className="inline-flex items-center justify-center outline-none relative tracking-tight leading-none h-10 text-15 px-6 rounded-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] font-semibold transition-colors duration-300 group">
              <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
              <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
              <span className="absolute inset-0 rounded-full bg-black"></span>
              <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
              <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
              <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent">
                Checkout More Events
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Curved Divider between Events and Success Stories */}
      <div className='w-full overflow-hidden leading-[0] bg-black'>
        <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
          <path d='M0,120 C360,20 720,20 1080,70 C1200,90 1320,110 1440,70 L1440,120 L0,120 Z' fill='#000000'></path>
        </svg>
      </div>

      {/* Success Stories Section with Extended Background */}
      <div className="relative overflow-hidden">
        {/* Extended background image covering section and curve */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <Image
            src="/councilbg.svg"
            alt="Success stories background"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Success Stories Content */}
        <section ref={storiesRef} className="relative py-16 md:py-20 lg:py-24">
          <div className="relative z-10 px-8 md:px-8 lg:px-12">
            <div className="w-full mx-auto flex justify-between mb-12">
              <div className="md:flex items-center justify-between">
                {/* Header */}
                <motion.div className="text-left mb-4 sm:w-full md:w-[35%]" initial="hidden" animate={storiesInView ? "visible" : "hidden"} variants={staggerContainer}>
                  <motion.h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-start font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent" variants={fadeInUp}>Success Stories</motion.h2>

                  <motion.div className="min-[500px]:w-10/12 mx-auto md:w-full" variants={fadeInUp}>
                    <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">We&apos;re a thriving community of learners, creators, and innovators — growing by helping one another. Every project, discussion, and challenge shapes us into better versions of ourselves.</p>

                    <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">Here, success isn&apos;t individual — it&apos;s shared. Whether it&apos;s mentorship, collaboration, or peer support, we celebrate every milestone as proof of what&apos;s possible when we move forward together.</p>
                  </motion.div>
                </motion.div>
                {/* Stories Grid */}
                <SuccessStories />
              </div>
            </div>
          </div>
        </section>

        {/* Curved Divider between Success Stories and Gallery */}
        <div className='w-full overflow-hidden leading-[0] relative z-10'>
          <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
            <path d='M0,120 C360,20 720,20 1080,70 C1200,90 1320,110 1440,70 L1440,120 L0,120 Z' fill='#ffffff'></path>
          </svg>
        </div>
      </div>

      <div ref={galleryRef} className="flex flex-col md:flex-row justify-between items-center bg-white px-6 md:px-12 py-16 md:py-32 gap-8 md:gap-0 overflow-hidden">
        <motion.div className="text-left w-full md:w-[35%] md:order-2" initial="hidden" animate={galleryInView ? "visible" : "hidden"} variants={staggerContainer}>
          <motion.h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-end font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-black" variants={fadeInUp}>See the Journey <br />Beyond the Wins</motion.h2>

          <motion.div className="min-[500px]:w-10/12 mx-auto md:w-full" variants={fadeInUp}>
            <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">We&apos;re a thriving community of learners, creators, and innovators — growing by helping one another. Every project, discussion, and challenge shapes us into better versions of ourselves.</p>

            <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">Here, success isn&apos;t individual — it&apos;s shared. Whether it&apos;s mentorship, collaboration, or peer support, we celebrate every milestone as proof of what&apos;s possible when we move forward together.</p>
          </motion.div>
        </motion.div>
        <ImageGallery />
      </div>
    </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import LightningBackground from "@/components/LightningBackground";
import DesignGallery from "@/components/DesignGallery";
import SuccessStories from "@/components/SuccessStories";
import Activites from "@/components/Activites";
import ImageGallery from "@/components/ImageGallery";
import EventCarousel from "@/components/EventCarousel";
import NotificationPopup from "@/components/NotificationPopup";

export default function Page() {
  const [stars, setStars] = useState<Array<{top: string, left: string, delay: string, duration: string}>>([]);

  useEffect(() => {
    // Reduce stars and defer their creation for better initial load
    const timer = setTimeout(() => {
      setStars(Array.from({ length: 30 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 2}s`
      })));
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Namdapha House',
    alternateName: 'Namdapha House IIT Madras BS',
    url: 'https://namdapha.iitmbs.org',
    logo: 'https://namdapha.iitmbs.org/logo-namdapha.webp',
    description: 'Namdapha House is the premier student community at IIT Madras BS Degree program with 5000+ students.',
    foundingDate: '2020',
    memberOf: {
      '@type': 'EducationalOrganization',
      name: 'IIT Madras',
      url: 'https://www.iitm.ac.in'
    },
    sameAs: [
      'https://www.instagram.com/namdaphahouse',
      'https://twitter.com/namdaphahouse',
      'https://www.linkedin.com/company/namdapha-house',
      'https://github.com/namdaphahouse'
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      <div className="absolute left-1/2 top-0 w-[2842px] max-w-none -translate-x-1/2 opacity-80 will-change-auto">
        <Image
          src="/bg.svg"
          alt="Background pattern"
          width={2842}
          height={1132}
          className="w-[2842px] max-w-none"
          loading="lazy"
          quality={75}
        />
      </div>

      <main className="relative z-10 flex items-center min-h-[60vh] px-6 md:px-8 lg:px-12 pt-24">
        <div className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center pt-4 md:pt-12 pb-20">
          <div className="space-y-6 pt-0">
            <div className="space-y-1 mt-6">
              <h1 className="text-4xl sm:text-[3rem] md:text-[3.5rem] lg:text-6xl xl:text-[4rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.1] tracking-tight">
                Legacy. <br />Leadership. <br />Limitless.
              </h1>
            </div>

            <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-[480px] leading-relaxed font-normal">
              Namdapha House is the premier student community at IIT Madras BS Degree program, uniting 5000+ students through academics, events, and leadership.
            </p>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full h-[300px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
              <div className="relative z-10 mx-auto w-full h-96 md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
                <LightningBackground />
                <div className="absolute inset-4 flex items-center justify-center z-10">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/logo-namdapha.webp"
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
          </div>
        </div>
      </main>

      <section id="about" className="relative bg-[rgb(228,229,231)] overflow-hidden py-16 md:py-24 scroll-mt-20">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="hidden lg:block absolute left-0 top-[45%] -translate-y-1/2 opacity-60 transform -translate-x-[30px] scale-105 pointer-events-none z-0 will-change-auto">
            <Image
              src="/bg2.svg"
              alt="Pattern left"
              width={358}
              height={1702}
              className="w-[358px] h-auto object-contain"
              loading="lazy"
              quality={60}
            />
          </div>

          <div className="hidden lg:block absolute right-0 top-[80%] -translate-y-1/2 opacity-60 transform translate-x-[30px] scale-105 pointer-events-none z-0 will-change-auto">
            <Image
              src="/bg2.svg"
              alt="Pattern right"
              width={358}
              height={1702}
              className="w-[358px] h-auto object-contain transform scale-x-[-1]"
              loading="lazy"
              quality={60}
            />
          </div>
        </div>

        <div className="relative z-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="relative mb-12">
                <div className="max-w-4xl mx-auto text-center px-4">
                  <h2 className="fs-48 text-center font-title font-medium text-gray-8">Who we are !</h2>

                  <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Namdapha House IIT Madras BS is a dynamic student community that thrives on unity, growth, and excellence. As part of the IIT Madras BS Degree program, we provide support in academics, opportunities in co-curriculars, and encouragement in extra-curriculars for all Namdapha House students.</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mt-8 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">5000+</div>
                      <div className="text-xs md:text-sm text-gray-600">Active Members</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">50+</div>
                      <div className="text-xs md:text-sm text-gray-600">Events Annually</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">11</div>
                      <div className="text-xs md:text-sm text-gray-600">Activity Communities</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">24/7</div>
                      <div className="text-xs md:text-sm text-gray-600">Community Support</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-12">
                    <div className="w-[300px] md:w-[340px] lg:w-[380px]">
                      <DesignGallery />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <div className="relative mb-12">
                <div className="max-w-5xl mx-auto px-4">
                  <h2 className="fs-48 text-center font-title font-medium text-gray-8 mb-6">What We Do</h2>
                  <p className="mx-auto max-w-[720px] text-center text-16 md:text-18 leading-relaxed text-gray-30">From academics to activities, Namdapha offers a holistic experience that nurtures talent, builds character, and creates lasting memories.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-12">
                    {[
                      { title: 'Academic Support', desc: 'Study groups, peer tutoring, and resource sharing to help everyone excel academically.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', bg: '/councilbg.svg' },
                      { title: 'Events & Workshops', desc: 'Tech talks, cultural fests, and skill-building workshops throughout the year.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', bg: '/teamsbg.svg' },
                      { title: 'Community Building', desc: 'Regular meetups, team activities, and social events to strengthen bonds.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', bg: '/events-hero-bg.svg' },
                      { title: 'Innovation Hub', desc: 'Hackathons, project collaborations, and tech competitions to fuel creativity.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', bg: '/resource-hub-bg.svg' },
                      { title: 'Sports & Recreation', desc: 'Gaming tournaments, fitness challenges, and recreational activities for all.', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', bg: '/council-rc-bg.svg' },
                      { title: 'Leadership Development', desc: 'Opportunities to lead teams, organize events, and develop management skills.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', bg: '/council-card-bg.svg' }
                    ].map((item, idx) => (
                      <div key={idx} className="relative rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-[#D4AF37] group">
                        <Image src={item.bg} alt="" fill className="object-cover" priority />
                        <div className="relative z-10">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center mb-2 sm:mb-3 md:mb-4 border border-[#D4AF37]/40">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                          </div>
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-lg mb-1 sm:mb-2">{item.title}</h3>
                          <p className="text-xs sm:text-sm text-white drop-shadow-md">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Activites />

      <section className="z-10 relative text-white bg-black py-16 px-6 md:px-8 lg:px-12 min-h-[400px]">
        <div className='absolute inset-0 pointer-events-none'>
          {stars.map((star, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-white rounded-full animate-twinkle'
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-title font-medium bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent mb-6">Namdapha Events</h2>
            <p className="text-sm lg:text-base font-light text-gray-300 text-pretty max-w-3xl mx-auto mb-8">At Namdapha, events are the heartbeat of our community. From tech, cultural, and sports fests to expert sessions and hands-on workshops, we create spaces that spark creativity and connection.</p>
          </div>

          <div className="flex flex-col items-center">
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
          </div>
        </div>
      </section>

      <div className='w-full overflow-hidden leading-[0] bg-black'>
        <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
          <path d='M0,120 C360,20 720,20 1080,70 C1200,90 1320,110 1440,70 L1440,120 L0,120 Z' fill='#000000'></path>
        </svg>
      </div>

      <div className="relative overflow-hidden bg-black min-h-[600px]">
        <div className="absolute inset-0 z-0 pointer-events-none bg-black" aria-hidden="true">
          <Image
            src="/councilbg.svg"
            alt="Success stories background"
            fill
            className="object-cover w-full h-full opacity-100"
            loading="lazy"
            quality={75}
            sizes="100vw"
          />
        </div>

        <section className="relative py-16 md:py-20 lg:py-24">
          <div className="relative z-10 px-8 md:px-8 lg:px-12">
            <div className="w-full mx-auto flex justify-between mb-12">
              <div className="md:flex items-center justify-between">
                <div className="text-left mb-4 sm:w-full md:w-[35%]">
                  <h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-start font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Success Stories</h2>

                  <div className="min-[500px]:w-10/12 mx-auto md:w-full">
                    <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">We&apos;re a thriving community of learners, creators, and innovators, growing by helping one another.</p>
                    <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">Here, success isn&apos;t individual it&apos;s shared.</p>
                  </div>
                </div>
                <SuccessStories />
              </div>
            </div>
          </div>
        </section>

        <div className='w-full overflow-hidden leading-[0] relative z-10'>
          <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
            <path d='M0,120 C360,20 720,20 1080,70 C1200,90 1320,110 1440,70 L1440,120 L0,120 Z' fill='#ffffff'></path>
          </svg>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white px-6 md:px-12 py-16 md:py-32 gap-8 md:gap-0 overflow-hidden min-h-[500px]">
        <div className="text-left w-full md:w-[35%] md:order-2">
          <h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-end font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-black">See the Journey <br />Beyond the Wins</h2>
          <div className="min-[500px]:w-10/12 mx-auto md:w-full">
            <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">We&apos;re a thriving community of learners, creators, and innovators.</p>
          </div>
        </div>
        <ImageGallery />
      </div>
    </div>
    <NotificationPopup />
    </>
  );
}

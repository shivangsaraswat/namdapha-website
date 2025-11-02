import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LightningBackground from "@/components/LightningBackground";
import DesignGallery from "@/components/DesignGallery";
import SuccessStories from "@/components/SuccessStories";
import Activites from "@/components/Activites";
import ImageGallery from "@/components/ImageGallery";
import EventCarousel from "@/components/EventCarousel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://namdapha.iitmbs.org'),
  title: 'Namdapha House',
  description: 'Namdapha House | General Student Body | IIT Madras',
};

export default function Page() {
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
          <div className="space-y-6 pt-0">
            {/* Hero Title */}
            <div className="space-y-1 mt-6">
              <h1 className="text-4xl sm:text-[3rem] md:text-[3.5rem] lg:text-6xl xl:text-[4rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.1] tracking-tight">
                Legacy. <br></br>Leadership. <br />Limitless.
              </h1>
            </div>

            {/* Hero Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-[480px] leading-relaxed font-normal">
              A vibrant house built on tradition, values, and excellence. Namdapha stands as a beacon of pride within the IIT Madras BS community.
            </p>
          </div>
          {/* Right Content - 3D Visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
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
          </div>
        </div>
      </main>

      <section id="about" className="relative bg-[rgb(228,229,231)] overflow-hidden py-16 md:py-24 scroll-mt-20">
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
                <div className="max-w-4xl mx-auto text-center px-4">
                  <h2 className="fs-48 text-center font-title font-medium text-gray-8">Who we are !</h2>

                  <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Namdapha House is a dynamic student community at IIT Madras BS Degree that thrives on unity, growth, and excellence. More than a house, it is a community where students find support in academics, opportunities in co-curriculars, and encouragement in extra-curriculars.</p>

                  {/* Stats Grid - centered layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mt-8 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">100+</div>
                      <div className="text-xs md:text-sm text-gray-600">Open source projects</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">2M+</div>
                      <div className="text-xs md:text-sm text-gray-600">Monthly downloads</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">50K+</div>
                      <div className="text-xs md:text-sm text-gray-600">GitHub stars</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">15+</div>
                      <div className="text-xs md:text-sm text-gray-600">Team members</div>
                    </div>
                  </div>

                  {/* Gallery - centered below stats */}
                  <div className="flex items-center justify-center mt-12">
                    <div className="w-[300px] md:w-[340px] lg:w-[380px]">
                      <DesignGallery />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer showcase section - follow council page structure */}
            <div className="mb-16">
              <div className="relative mb-12">
                <div className="max-w-4xl mx-auto text-center px-4">
                  <h2 className="fs-48 text-center font-title font-medium text-gray-8">Developer tools, reimagined</h2>
                  <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">We understand the challenges developers face. That&apos;s why we build products that streamline workflows, eliminate friction, and empower developers to focus on what they do best: making great products.</p>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center mt-8">
                    {/* Top-left card */}
                    <div className="rounded-xl overflow-hidden bg-black/90 shadow-lg max-w-sm w-full">
                      <div className="w-full h-52 md:h-64 lg:h-72 relative">
                        <Image src="/events-hero-bg.svg" alt="Build Better" fill className="object-cover" priority />
                      </div>
                      <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-xl md:text-2xl font-semibold text-white">Build Better<br />Software, Faster</h3>
                        <p className="mt-2 text-sm text-gray-300">&gt; &gt; &gt;</p>
                      </div>
                    </div>

                    {/* Top-right card */}
                    <div className="rounded-xl overflow-hidden bg-black/90 shadow-lg max-w-sm w-full">
                      <div className="w-full h-52 md:h-64 lg:h-72 relative">
                        <Image src="/councilbg.svg" alt="Zapp.run" fill className="object-cover" priority />
                      </div>
                      <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-semibold text-white">Zapp.run</h3>
                        <p className="mt-2 text-sm text-gray-300">Learn, build & share Flutter applications</p>
                      </div>
                    </div>

                    {/* Bottom-left card */}
                    <div className="rounded-xl overflow-hidden bg-black/90 shadow-lg max-w-sm w-full">
                      <div className="w-full h-52 md:h-64 lg:h-72 relative">
                        <Image src="/teamsbg.svg" alt="Globe.dev" fill className="object-cover" priority />
                      </div>
                      <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-semibold text-white">Globe.dev</h3>
                        <p className="mt-2 text-sm text-gray-300">Deploy full-stack Flutter applications.</p>
                      </div>
                    </div>

                    {/* Bottom-right card */}
                    <div className="rounded-xl overflow-hidden bg-black/90 shadow-lg max-w-sm w-full">
                      <div className="w-full h-52 md:h-64 lg:h-72 relative">
                        <Image src="/councilelement.avif" alt="Docs.page" fill className="object-cover" priority />
                      </div>
                      <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-semibold text-white">Docs.page</h3>
                        <p className="mt-2 text-sm text-gray-300">Ship documentation, like you ship code.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Activites />

      <section className="z-10 relative text-white bg-black py-16 px-6 md:px-8 lg:px-12">
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
        <div className="max-w-7xl mx-auto">
          {/* Heading Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-title font-medium bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent mb-6">Namdapha Events</h2>
            <p className="text-sm lg:text-base font-light text-gray-300 text-pretty max-w-3xl mx-auto mb-8">At Namdapha, events are the heartbeat of our community. From tech, cultural, and sports fests to expert sessions and hands-on workshops, we create spaces that spark creativity and connection. Each event brings students together, encouraging collaboration, learning, and personal growth within the vibrant spirit of Namdapha.</p>
          </div>

          {/* Events Content */}
          <div className="flex flex-col items-center">
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
          </div>
        </div>
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
        <section className="relative py-16 md:py-20 lg:py-24">
          <div className="relative z-10 px-8 md:px-8 lg:px-12">
            <div className="w-full mx-auto flex justify-between mb-12">
              <div className="md:flex items-center justify-between">
                {/* Header */}
                <div className="text-left mb-4 sm:w-full md:w-[35%]">
                  <h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-start font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Success Stories</h2>

                  <div className="min-[500px]:w-10/12 mx-auto md:w-full">
                    <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">We&apos;re a thriving community of learners, creators, and innovators — growing by helping one another. Every project, discussion, and challenge shapes us into better versions of ourselves.</p>

                    <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">Here, success isn&apos;t individual — it&apos;s shared. Whether it&apos;s mentorship, collaboration, or peer support, we celebrate every milestone as proof of what&apos;s possible when we move forward together.</p>
                  </div>
                </div>
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

      <div className="flex flex-col md:flex-row justify-between items-center bg-white px-6 md:px-12 py-16 md:py-32 gap-8 md:gap-0 overflow-hidden">
        <div className="text-left w-full md:w-[35%] md:order-2">
          <h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-end font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-black">See the Journey <br />Beyond the Wins</h2>

          <div className="min-[500px]:w-10/12 mx-auto md:w-full">
            <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">We&apos;re a thriving community of learners, creators, and innovators — growing by helping one another. Every project, discussion, and challenge shapes us into better versions of ourselves.</p>

            <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">Here, success isn&apos;t individual — it&apos;s shared. Whether it&apos;s mentorship, collaboration, or peer support, we celebrate every milestone as proof of what&apos;s possible when we move forward together.</p>
          </div>
        </div>
        <ImageGallery />
      </div>
    </div>
    </>
  );
}

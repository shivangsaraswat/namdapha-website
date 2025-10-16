import Image from "next/image";
import Navbar from "@/components/Navbar";
import LightningBackground from "@/components/LightningBackground";
import DesignGallery from "@/components/DesignGallery";

export default function Page() {
  return (
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
        <div className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 pt-0">
            {/* Hero Title */}
            <div className="space-y-1 mt-6">
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.75rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.1] tracking-tight">
                Empower Community.<br />Engineer excellence.
              </h1>
            </div>

            {/* Hero Subtitle */}
            <p className="text-sm md:text-base text-gray-300 max-w-[480px] leading-relaxed font-normal">
              We help technology companies provide exceptional developer experiences. We make developer tools, SDKs, and libraries for the open-source ecosystem.
            </p>

            

            {/* CTA Buttons */}
          <div className="container-md w-full relative z-10 mt-12 flex flex-col items-start text-left lg:mt-10 md:mt-10 sm:mt-8">

            <a className="self-start transition-colors duration-300 group inline-flex items-center outline-none relative justify-center tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-10 text-15 px-6 rounded-full md:h-9 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] mt-4 font-semibold" href="/careers">
            <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
            <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
            <span className="absolute inset-0 rounded-full bg-black"></span>
            <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
            <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
            <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent">
              <span className="">See open positions</span></span></a>
          </div>
</div>
          {/* Right Content - 3D Visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
              {/* Background glow effects */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/10 to-blue-500/10 rounded-full blur-2xl"></div> */}
              
              {/* 3D Object representation - Simplified */}
              <div className="relative z-10 w-96 h-96 md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
  
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

      {/* Services Section */}
      <section className="relative z-10 px-6 py-12 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-white">Our services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* SDK Development */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </div>
                <h3 className="mt-3 md:mt-0 text-lg md:text-xl font-semibold text-white">SDK Development</h3>
              </div>
              <p className="text-sm lg:text-base text-gray-300 leading-relaxed">Empower developers with reliable, well-designed SDKs that integrate seamlessly into your platform, inspiring them to build amazing solutions.</p>
              <a className="text-white/80 hover:text-white text-sm font-medium inline-flex items-center gap-2" href="#">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* SDK Maintenance */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.4 15a8 8 0 11-1.4-1.8" />
                  </svg>
                </div>
                <h3 className="mt-3 md:mt-0 text-lg md:text-xl font-semibold text-white">SDK Maintenance</h3>
              </div>
              <p className="text-sm lg:text-base text-gray-300 leading-relaxed">Keep your SDKs up-to-date, secure, and efficient with our maintenance services, handling updates, fixes, and compatibility, so your team can focus.</p>
              <a className="text-white/80 hover:text-white text-sm font-medium inline-flex items-center gap-2" href="#">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Cross-Platform Development */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
                  </svg>
                </div>
                <h3 className="mt-3 md:mt-0 text-lg md:text-xl font-semibold text-white">Cross-Platform Development</h3>
              </div>
              <p className="text-sm lg:text-base text-gray-300 leading-relaxed">Accelerate development and time-to-market with a unified codebase. We migrate apps to Flutter or React Native, enabling faster builds and innovation.</p>
              <a className="text-white/80 hover:text-white text-sm font-medium inline-flex items-center gap-2" href="#">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="relative bg-[rgb(228,229,231)] overflow-hidden py-16 md:py-24">
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

                  <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">We embrace freedom, flexibility, and global collaboration. As a fully remote company, our team is empowered to do their best work, from anywhere in the world. Together we&apos;re transforming developer experiences.</p>

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

      {/* Success Stories Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <Image
            src="/home-event-bg.svg"
            alt="Success stories background"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-left mb-16">
              <h2 className="fs-48 font-title font-medium text-gray-94">Success stories</h2>

              <p className="mt-2.5 max-w-[500px] text-18 leading-snug tracking-tight text-gray-70 sm:mt-1.5 sm:text-16">Explore how we’ve transformed developer experiences.</p>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {/* Google Card */}
              <div className="group relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-white text-3xl font-bold">Google</div>
                </div>
              </div>

              {/* Canonical Card */}
              <div className="group relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-orange-800 to-orange-900 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-white text-2xl font-bold">Canonical</span>
                  </div>
                </div>
              </div>

              {/* Widgetbook Case Study Card */}
              <div className="group relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 md:col-span-2 lg:col-span-1">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/home-event-bg.svg"
                    alt="Widgetbook case study"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Widgetbook logo */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                    <span className="font-semibold text-gray-900">widgetbook</span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-2 leading-tight">
                      Making Documentation Easy for Widgetbook with docs.page
                    </h3>
                    <button className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors">
                      Read case study
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Join Team Section */}
           <div className="container-md relative z-10 mt-44 flex flex-col items-center text-center lg:mt-36 md:mt-32 sm:mt-24">
            <h2 className="fs-48 font-title font-medium text-gray-94">Join our growing team</h2>
            <p className="mt-2.5 max-w-[410px] text-18 leading-snug tracking-tight text-gray-70 md:max-w-[400px] md:text-16 sm:mt-1.5">Obsessed with developer experience? So are we. Come shape the future with us.</p>
            <a className="transition-colors duration-200 transition-colors duration-300 group inline-flex items-center outline-none relative justify-center tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-10 text-15 px-6 rounded-full md:h-9 relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] group mt-9 font-semibold lg:mt-5 md:mt-5" href="/careers">
            
            <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
            
            <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
            
            <span className="absolute inset-0 rounded-full bg-black"></span>
            <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
            
            <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
            <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent">
              <span className="">See open positions</span></span></a></div>
          </div>
        </div>
      </section>

      {/* How we work Section */}
      <section className="relative bg-[rgb(228,229,231)] overflow-hidden py-16 md:py-24">
        <div className="relative z-10 px-6 md:px-8 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Content */}
              <div className="max-w-md">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
                  How we work
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed">
                  Interested in working with us? View open positions
                </p>
                <a href="#" className="text-orange-500 hover:text-orange-600 font-semibold inline-flex items-center text-sm md:text-base">
                  Our open positions
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Right Content - Grid of work principles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Collaboration & knowledge sharing */}
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Collaboration & knowledge sharing</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    We promote open communication and encourage everyone to share their expertise, driving innovation in open-source development.
                  </p>
                </div>

                {/* Asynchronous communication */}
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Asynchronous communication</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    We leverage tools and practices that allow for focused work and flexible schedules, empowering our team to achieve a healthy work-life balance.
                  </p>
                </div>

                {/* Autonomy and ownership */}
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Autonomy and ownership</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    We trust our team to take ownership of their work and make impactful decisions, promoting a sense of responsibility and pride in their contributions.
                  </p>
                </div>

                {/* Impact-driven mindset */}
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 002 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Impact-driven mindset</h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    We&apos;re passionate about making a real difference in the developer community, and we celebrate the positive impact our work has on developers worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

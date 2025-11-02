import Image from "next/image";
import Navbar from "@/components/Navbar";
import LightningBackground from "@/components/LightningBackground";
import DesignGallery from "@/components/DesignGallery";
import SuccessStories from "@/components/SuccessStories";
import Activites from "@/components/Activites";

import ImageGallery from "@/components/ImageGallery";

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
        <div className="max-w-[1200px] mx-auto w-full grid lg:grid-cols-2 gap-12 items-center pt-4 md:pt-12 pb-20">
          {/* Left Content */}
          <div className="space-y-6 pt-0">
            {/* Hero Title */}
            <div className="space-y-1 mt-6">
              <h1 className="text-4xl sm:text-[3rem] md:text-[3.5rem] lg:text-6xl xl:text-[4rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.1] tracking-tight">
                Empower Community.<br />Engineer excellence.
              </h1>
            </div>

            {/* Hero Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-[480px] leading-relaxed font-normal">
              We help technology companies provide exceptional developer experiences. We make developer tools, SDKs, and libraries for the open-source ecosystem.
            </p>



            {/* CTA Buttons */}
            <div className="container-md w-full relative z-10 mt-6 flex flex-col items-start text-left lg:mt-10 md:mt-10 sm:mt-8">

              <a className="self-start transition-colors duration-300 group inline-flex items-center outline-none relative justify-center tracking-tight leading-none focus:outline-white focus:outline-1 focus:outline-offset-4 h-9 text-15 px-6 rounded-full md:h-9 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.74)] mt-4 font-semibold" href="/careers">
                <span className="absolute -inset-px bottom-[-1.5px] rounded-full bg-[linear-gradient(180deg,#fcc171_0%,#C17C56_50%,#362821_100%)]"></span>
                <span className="absolute -top-[5px] bottom-0.5 left-1/2 w-[91%] -translate-x-1/2 bg-btn-glowing mix-blend-screen blur-[1px] transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]"></span>
                <span className="absolute inset-0 rounded-full bg-black"></span>
                <span className="absolute inset-0 rounded-full bg-btn-glowing-inset opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"></span>
                <span className="absolute inset-0 rounded-full bg-btn-glowing-inset-hover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></span>
                <span className="relative z-20 bg-[linear-gradient(180deg,#FFF_33.33%,#E4D0B1_116.67%)] bg-clip-text text-transparent text-sm lg:text-base xl:text-lg">
                  <span className="">See open positions</span></span></a>
            </div>
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

      <Activites />

      <section className="flex flex-col items-center z-10 relative justify-center text-white bg-black py-10 max-sm:px-8 sm:px-10 md:px-10">
        <div className=' md:w-10/12 lg:w-8/12 xl:w-6/12 flex flex-col justify-center items-center gap-6'>
          <h2 className='text-4xl md:text-5xl text-center xl:text-6xl font-bold bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent'>Namdapha Events</h2>
          <p className='text-center text-sm lg:text-base font-light text-gray-300 text-pretty'>Namdapha Activities brings together a vibrant mix of 11 communities — from gaming and coding to art, storytelling, and debate. It’s where students connect, collaborate, and grow by pursuing what they love beyond the classroom.</p>
        </div>
        <div className="flex flex-wrap mx-auto justify-center items-center w-full my-6 gap-4">
          <div className="w-64 h-80 md:w-72 border border-gray-700 rounded-xl relative md:h-96 flex flex-col justify-end overflow-hidden bg-cover" style={{ backgroundImage: 'url("/bgmi.jpg")' }} >
            <div className="absolute left-0 top-0 w-full h-full z-0 bg-cover bg-gradient-to-b from-black/10 via-60% via-black/70 to-black/100" />
            <h3 className="text-base md:text-lg font-medium mt-4 px-4 text-pretty z-10 relative">React Native Firebase Roadmap</h3>
            <div className="flex items-center gap-2 mt-3 px-4 z-10 relative">
              <p className="bg-purple-800 rounded-xl px-2 md:px-3 py-1 text-center text-sm md:text-base">Firebase</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Date</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Venue</p>
            </div>
            <p className="text-xs md:text-sm lg:text-base mt-2 px-4 mb-4 text-pretty text-gray-300 font-light relative z-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempora culpa alias, atque exercitationem tenetur, placeat debitis voluptas veritatis sed</p>
          </div>
                    <div className="w-64 h-80 md:w-72 border border-gray-700 rounded-xl relative md:h-96 flex flex-col justify-end overflow-hidden bg-cover" style={{ backgroundImage: 'url("/bgmi.jpg")' }} >
            <div className="absolute left-0 top-0 w-full h-full z-0 bg-cover bg-gradient-to-b from-black/10 via-60% via-black/70 to-black/100" />
            <h3 className="text-base md:text-lg font-medium mt-4 px-4 text-pretty z-10 relative">React Native Firebase Roadmap</h3>
            <div className="flex items-center gap-2 mt-3 px-4 z-10 relative">
              <p className="bg-purple-800 rounded-xl px-2 md:px-3 py-1 text-center text-sm md:text-base">Firebase</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Date</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Venue</p>
            </div>
            <p className="text-xs md:text-sm lg:text-base mt-2 px-4 mb-4 text-pretty text-gray-300 font-light relative z-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempora culpa alias, atque exercitationem tenetur, placeat debitis voluptas veritatis sed</p>
          </div>
                    <div className="w-64 h-80 md:w-72 border border-gray-700 rounded-xl relative md:h-96 flex flex-col justify-end overflow-hidden bg-cover" style={{ backgroundImage: 'url("/bgmi.jpg")' }} >
            <div className="absolute left-0 top-0 w-full h-full z-0 bg-cover bg-gradient-to-b from-black/10 via-60% via-black/70 to-black/100" />
            <h3 className="text-base md:text-lg font-medium mt-4 px-4 text-pretty z-10 relative">React Native Firebase Roadmap</h3>
            <div className="flex items-center gap-2 mt-3 px-4 z-10 relative">
              <p className="bg-purple-800 rounded-xl px-2 md:px-3 py-1 text-center text-sm md:text-base">Firebase</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Date</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Venue</p>
            </div>
            <p className="text-xs md:text-sm lg:text-base mt-2 px-4 mb-4 text-pretty text-gray-300 font-light relative z-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempora culpa alias, atque exercitationem tenetur, placeat debitis voluptas veritatis sed</p>
          </div>
          <div className="w-64 h-80 md:w-72 border border-gray-700 rounded-xl relative md:h-96 flex flex-col justify-end overflow-hidden bg-cover" style={{ backgroundImage: 'url("/bgmi.jpg")' }} >
            <div className="absolute left-0 top-0 w-full h-full z-0 bg-cover bg-gradient-to-b from-black/10 via-60% via-black/70 to-black/100" />
            <h3 className="text-base md:text-lg font-medium mt-4 px-4 text-pretty z-10 relative">React Native Firebase Roadmap</h3>
            <div className="flex items-center gap-2 mt-3 px-4 z-10 relative">
              <p className="bg-purple-800 rounded-xl px-2 md:px-3 py-1 text-center text-sm md:text-base">Firebase</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Date</p>
              <p className="text-purple-400 px-2 md:px-3 py-1 border border-purple-700 rounded-xl text-sm md:text-base">Venue</p>
            </div>
            <p className="text-xs md:text-sm lg:text-base mt-2 px-4 mb-4 text-pretty text-gray-300 font-light relative z-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempora culpa alias, atque exercitationem tenetur, placeat debitis voluptas veritatis sed</p>
          </div>
        </div>
        <button className="border border-gray-600 px-5 py-2 rounded-xl hover:bg-gray-800 cursor-pointer">Checkout More Events</button>
      </section>

      {/* Success Stories Section */}
      <section className="relative overflow-hidden py-8 md:py-10 lg:py-6">
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
        <div className="relative z-10 px-8 md:px-8 lg:px-12">
          <div className="w-full mx-auto flex justify-between mb-12">
            <div className="md:flex items-center justify-between">
              {/* Header */}
              <div className="text-left mb-4 sm:w-full md:w-[35%]">
                <h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-start font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent">Success Stories</h2>

                <div className="min-[500px]:w-10/12 mx-auto md:w-full">
                  <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">We’re a thriving community of learners, creators, and innovators — growing by helping one another. Every project, discussion, and challenge shapes us into better versions of ourselves.</p>

                  <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-left xl:text-lg mx-auto md:w-full text-gray-300 font-light leading-snug tracking-tight">Here, success isn’t individual — it’s shared. Whether it’s mentorship, collaboration, or peer support, we celebrate every milestone as proof of what’s possible when we move forward together.</p>
                </div>
              </div>
              {/* Stories Grid */}
              <SuccessStories />
            </div>
          </div>
        </div>
      </section>
      <div className="md:flex justify-between items-center bg-white px-12 py-16">
        <div className="text-left mb-4 sm:w-full md:w-[35%] md:order-2">
          <h2 className="text-4xl sm:text-6xl max-md:text-center md:text-[2.5rem] md:leading-12 lg:text-[3.5rem] lg:leading-16 xl:text-6xl font-title md:text-end font-medium text-pretty bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-black">See the Journey <br />Beyond the Wins</h2>

          <div className="min-[500px]:w-10/12 mx-auto md:w-full">
            <p className="mt-6 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">We’re a thriving community of learners, creators, and innovators — growing by helping one another. Every project, discussion, and challenge shapes us into better versions of ourselves.</p>

            <p className="mt-4 text-sm max-md:text-center w-full md:text-sm md:text-end xl:text-lg mx-auto md:w-full text-gray-400 font-medium leading-snug tracking-tight text-pretty">Here, success isn’t individual — it’s shared. Whether it’s mentorship, collaboration, or peer support, we celebrate every milestone as proof of what’s possible when we move forward together.</p>
          </div>
        </div>
        <ImageGallery />
      </div>
    </div>
  );
}

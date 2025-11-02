'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import EventFooter from '@/components/EventFooter';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

export default function WhatsappPage() {
  const [isFormLoading, setIsFormLoading] = useState(true);
  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Hero Section with Navbar */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/bg.svg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-[60]">
          <Navbar />
        </div>

        <div className="relative z-10 py-12 px-6 md:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Join WhatsApp Community
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Connect with fellow members and stay updated with the latest announcements
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Google Form Embed Section */}
        <div className="relative min-h-[1600px]">
          {isFormLoading && <LoadingSpinner />}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSe8v01Zd3jp7M_wlZDA0P0kGv_uG_x31JErPxAFJC-vM1H5wQ/viewform?embedded=true&bgcolor=E4E5E7"
            width="100%"
            height="1600"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            style={{ border: 'none' }}
            onLoad={() => setIsFormLoading(false)}
            className={`transition-opacity duration-300 ${isFormLoading ? 'opacity-0' : 'opacity-100'}`}
          >
            Loading…
          </iframe>
        </div>
      </main>

      <EventFooter />
    </div>
  );
}

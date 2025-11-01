"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from 'react';
import { councilService, type CouncilMember } from '@/lib/councilService';

export default function CouncilPage(){
  const [councilData, setCouncilData] = useState<{
    houseLeadership: CouncilMember[];
    regionalCoordinators: CouncilMember[];
  }>({ houseLeadership: [], regionalCoordinators: [] });

  useEffect(() => {
    let mounted = true;

    const fetchCouncilData = async () => {
      try {
        const [leadership, coordinators] = await Promise.all([
          councilService.getLeadership(),
          councilService.getCoordinators()
        ]);
        
        if (mounted) {
          setCouncilData({
            houseLeadership: leadership,
            regionalCoordinators: coordinators
          });
        }
      } catch (error) {
        console.error('Error fetching council data:', error);
      }
    };
    
    fetchCouncilData();

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Background SVG*/}
      <div className="absolute left-1/2 top-0 w-[2842px] h-[566px] max-w-none -translate-x-1/2 overflow-hidden">
        <Image
          src="/councilbg.svg"
          alt="Background pattern"
          width={2842}
          height={566}
          className="w-[2842px] h-[566px] max-w-none object-cover"
          priority
        />
      </div>

      {/* Navbar */}
      <div className="relative z-20 text-white">
        <Navbar />
      </div>

      {/* Hero Section - large centered heading over bg */}
      <main className="relative z-10">
        <section className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[566px] flex items-center justify-center px-6">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Decorative element positioned above the heading (moved closer to center) */}
            <div className="absolute -top-6 md:-top-10 lg:-top-14 flex items-center justify-center pointer-events-none">
              <Image
                src="/councilelement.avif"
                alt="Decorative element"
                width={1600}
                height={900}
                className="w-[520px] md:w-[920px] lg:w-[1280px] h-auto object-contain"
                priority
              />
            </div>

            {/* Text content - reduced top padding so it sits closer under the element */}
            <div className="text-center pt-12 md:pt-20 lg:pt-24 px-4">
              <h1 className="font-title font-extrabold text-[3rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] xl:text-[6.5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent leading-[0.99] tracking-tight mb-4">
                Council 2025-26
              </h1>

              {/* <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">Empower your engineers to build cross-platform apps with Flutter and React Native. Reduce development time, get products to market faster.</p> */}

            </div>
          </div>
        </section>

         {/* Council Members Section */}
         <section className="relative z-10 pt-[566px] pb-16 px-6">
           <div className="max-w-7xl mx-auto">
             {/* House Leadership Section */}
             <div className="mb-16">
              <div className="relative mb-12">
                {/* Left side decorative pattern: placed specifically for House Leadership */}
                <div className="hidden lg:block absolute left-0 top-[141%] -translate-y-1/2 opacity-100 transform -translate-x-[220px] scale-105 pointer-events-none z-0">
                  <Image
                    src="/bg2.svg"
                    alt="Pattern"
                    width={358}
                    height={1702}
                    className="w-[358px] h-auto object-contain"
                  />
                </div>

                {/* Right side decorative pattern (mirrored) */}
                <div className="hidden lg:block absolute right-0 top-[250%] -translate-y-1/2 opacity-100 transform translate-x-[220px] scale-105 pointer-events-none z-0">
                  <Image
                    src="/bg2.svg"
                    alt="Pattern"
                    width={358}
                    height={1702}
                    className="w-[358px] h-auto object-contain transform scale-x-[-1]"
                  />
                </div>
 
                 {/* Centered content wrapper - widened so 3 poster cards fit with spacing */}
                 <div className="max-w-7xl mx-auto text-center px-6">
                     <h2 className="fs-48 text-center font-title font-medium text-gray-8">House Leadership</h2>

                   <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">We understand the challenges developers face. That’s why we build products that streamline workflows, eliminate friction, and empower developers to focus on what they do best: making great products.</p>

                   {/* Cards Row (flex) - center the fixed-width posters so side gaps are even */}
                   <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 lg:gap-6 mt-8">
                     {councilData.houseLeadership.map((member) => (
                       <div key={member.id} className="relative group">
                         <div className="w-[360px] h-[480px] rounded-none overflow-hidden bg-[rgb(245,245,245)] flex items-center justify-center">
                           {member.imageUrl ? (
                             <Image
                               src={member.imageUrl}
                               alt={member.name}
                               width={720}
                               height={960}
                               className="w-full h-full object-cover"
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-200">
                               <span className="text-gray-500">No Image</span>
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
              </div>
 
              {/* Regional Coordinator Section */}
              <div className="mb-16">
               <div className="relative">
                 {/* no left-side pattern here so decorative svg appears only for House Leadership */}
 
                 {/* Centered content wrapper */}
                 <div className="max-w-5xl mx-auto text-center px-4">
                  <h2 className="fs-48 text-center font-title font-medium text-gray-8">Regional Coordinators</h2>
                   
                    <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">We understand the challenges developers face. That’s why we build products that streamline workflows, eliminate friction, and empower developers to focus on what they do best: making great products.</p>

                  {/* Cards Grid - 4 columns for regional coordinators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center mt-8">
                    {councilData.regionalCoordinators.map((member, idx) => {
                      // For the last row with two items (when total % 4 === 2), place them in cols 2 and 3 to center
                      const lgPositionClass = (idx >= 8 && idx % 4 === 0) ? 'lg:col-start-2' : (idx >= 8 && idx % 4 === 1 ? 'lg:col-start-3' : '');
                      return (
                        <div key={member.id} className={`relative group ${lgPositionClass}`}>
                          <div className="relative w-[240px] h-[380px] rounded-[20px] overflow-hidden">
                          {/* Background SVG */}
                          <div className="absolute inset-0">
                            <Image
                              src="/council-rc-bg.svg"
                              alt="RC card background"
                              width={340}
                              height={328}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Card Content */}
                          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                             {/* Profile Image (expanded to fill more vertical space in RC card) */}
                             <div className="w-full h-[84%] mx-auto mb-1 rounded-[12px] overflow-hidden mt-1">
                               {(() => {
                                 const imageSrc = typeof member.imageUrl === 'string' && member.imageUrl.trim() !== '' ? member.imageUrl.trim() : null;
                                 if (imageSrc) {
                                   return (
                                     <Image
                                       src={imageSrc}
                                       alt={member.name}
                                       width={360}
                                       height={420}
                                       className="w-full h-full object-cover"
                                     />
                                   );
                                 }
                                 return (
                                   <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                     <span className="text-gray-500 text-xs">No Image</span>
                                   </div>
                                 );
                               })()}
                             </div>

                             {/* Name and Position */}
                             <div className="text-center">
                               {/* name/position intentionally hidden on frontend */}
                  </div>
                           </div>
                         </div>
                        </div>
                      );
                    })}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

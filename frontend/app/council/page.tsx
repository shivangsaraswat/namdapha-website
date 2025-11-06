"use client";

import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from 'react';
import { councilService, type CouncilMember } from '@/lib/councilService';

export default function CouncilPage(){
  const [councilData, setCouncilData] = useState<{
    houseLeadership: CouncilMember[];
    regionalCoordinators: CouncilMember[];
  }>({ houseLeadership: [], regionalCoordinators: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouncilData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const [leadership, coordinators] = await Promise.all([
          councilService.getLeadership(),
          councilService.getCoordinators()
        ]);
        
        setCouncilData({
          houseLeadership: leadership,
          regionalCoordinators: coordinators
        });
      } catch (error) {
        console.error('Error fetching council data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCouncilData();
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Hero Section with Navbar */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/councilbg.svg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-20 mt-16">
            <Image
              src="/logo-namdapha.png"
              alt="NAMP Logo"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="relative z-10 py-32 px-6 md:px-8 lg:px-12 pt-36">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Council 2025-26
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10">
         {/* Council Members Section */}
         <section className="pt-16 pb-16 px-6">
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

                   <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">The Upper House Council (UHC) leads Namdapha by guiding its members, organizing events, and representing the House in inter-house and institutional meetings. It ensures coordination, inclusivity, and the overall growth of the Namdapha community.</p>

                   {/* Cards Row (flex) - center the fixed-width posters so side gaps are even */}
                   <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 lg:gap-6 mt-8">
                     {councilData.houseLeadership.map((member) => (
                       <div key={member.id} className="relative group">
                         {member.imageUrl ? (
                           member.imageUrl.includes('.svg') || member.imageUrl.includes('data:image/svg') ? (
                             <Image
                               src={member.imageUrl}
                               alt={member.name}
                               width={360}
                               height={480}
                               className="w-auto h-auto max-w-[360px]"
                               unoptimized
                             />
                           ) : (
                             <Image
                               src={member.imageUrl}
                               alt={member.name}
                               width={360}
                               height={480}
                               className="w-auto h-auto max-w-[360px]"
                               unoptimized
                             />
                           )
                         ) : (
                           <div className="w-[360px] h-[480px] flex items-center justify-center bg-gray-200">
                             <span className="text-gray-500">No Image</span>
                           </div>
                         )}
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
                   
                    <p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Regional Coordinators (RCs) form Namdapha’s Lower House Council, connecting students across regions, sharing updates, and offering guidance to keep everyone informed and supported.</p>

                  {/* Cards Grid - 3 columns for regional coordinators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-8">
                    {councilData.regionalCoordinators.map((member) => {
                      const imageSrc = typeof member.imageUrl === 'string' && member.imageUrl.trim() !== '' ? member.imageUrl.trim() : null;
                      return (
                        <div key={member.id} className="relative group">
                          {imageSrc ? (
                            imageSrc.includes('.svg') || imageSrc.includes('data:image/svg') ? (
                              <Image
                                src={imageSrc}
                                alt={member.name}
                                width={400}
                                height={386}
                                className="w-full h-auto max-w-[400px]"
                                unoptimized
                              />
                            ) : (
                              <Image
                                src={imageSrc}
                                alt={member.name}
                                width={400}
                                height={386}
                                className="w-full h-auto max-w-[400px]"
                                unoptimized
                              />
                            )
                          ) : (
                            <div className="w-[400px] h-[386px] flex items-center justify-center bg-gray-200">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
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

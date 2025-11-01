"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { teamService, type TeamMember } from '@/lib/teamService';

export default function TeamsPage() {
  const [teamData, setTeamData] = useState<{
    webops: TeamMember[];
    multimedia: TeamMember[];
    outreach: TeamMember[];
  }>({ webops: [], multimedia: [], outreach: [] });

  useEffect(() => {
    let mounted = true;

    const fetchTeamData = async () => {
      try {
        console.log('Fetching team data...');
        const [webops, multimedia, outreach] = await Promise.all([
          teamService.getMembersByCategory('webops'),
          teamService.getMembersByCategory('multimedia'),
          teamService.getMembersByCategory('outreach')
        ]);
        
        console.log('Webops:', webops);
        console.log('Multimedia:', multimedia);
        console.log('Outreach:', outreach);
        
        if (mounted) {
          setTeamData({ webops, multimedia, outreach });
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };
    
    fetchTeamData();

    return () => {
      mounted = false;
    };
  }, []);

	return (
		<div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
			{/* Hero Section with Navbar */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0">
					<Image
						src="/teamsbg.svg"
						alt="Hero background"
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 flex items-center justify-center opacity-20">
						<Image
							src="/logo-namdapha.png"
							alt="NAMP Logo"
							width={300}
							height={300}
							className="object-contain"
						/>
					</div>
				</div>
				
				<div className="relative z-[60]">
					<Navbar />
				</div>

				<div className="relative z-10 py-24 px-6 md:px-8 lg:px-12">
					<div className="max-w-[1400px] mx-auto text-center">
						<h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
							Department Teams
						</h1>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="relative z-10">
				<section className="pt-16 pb-16 px-6">
					<div className="max-w-7xl mx-auto">
						<div className="mb-16">
							<div className="relative mb-12">
								<div className="hidden lg:block absolute left-0 top-[141%] -translate-y-1/2 opacity-100 transform -translate-x-[220px] scale-105 pointer-events-none z-0">
									<Image
										src="/bg2.svg"
										alt="Pattern"
										width={358}
										height={1702}
										className="w-[358px] h-auto object-contain"
									/>
								</div>

								<div className="hidden lg:block absolute right-0 top-[250%] -translate-y-1/2 opacity-100 transform translate-x-[220px] scale-105 pointer-events-none z-0">
									<Image
										src="/bg2.svg"
										alt="Pattern"
										width={358}
										height={1702}
										className="w-[358px] h-auto object-contain transform scale-x-[-1]"
									/>
								</div>

								<div className="max-w-7xl mx-auto text-center px-6">
									<h2 className="fs-48 text-center font-title font-medium text-gray-8">
										Web-Ops
									</h2>

									<p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">
										We understand the challenges developers face. That&apos;s why we
										build products that streamline workflows, eliminate friction,
										and empower developers to focus on what they do best: making
										great products.
									</p>

									<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 lg:gap-6 mt-8">
										{teamData.webops.map((member) => (
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

						<div className="mb-16">
							<div className="relative">
								<div className="max-w-5xl mx-auto text-center px-4">
									<h2 className="fs-48 text-center font-title font-medium text-gray-8">Multimedia</h2>
									<p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Creative team responsible for visuals, video and media across channels.</p>
									<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 lg:gap-6 mt-8">
										{teamData.multimedia.map((member) => (
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

						<div className="mb-16">
							<div className="relative">
								<div className="max-w-5xl mx-auto text-center px-4">
									<h2 className="fs-48 text-center font-title font-medium text-gray-8">Out Reach</h2>
									<p className="mx-auto mt-6 max-w-[688px] text-center text-18 leading-snug tracking-tight text-gray-30 sm:mt-4 sm:text-16">Team focused on events, partnerships and community engagement.</p>
									<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 lg:gap-6 mt-8">
										{teamData.outreach.map((member) => (
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
					</div>
				</section>
			</main>
		</div>
	);
}

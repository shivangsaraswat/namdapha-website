"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import EventFooter from "@/components/EventFooter";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Event {
	id: string;
	title: string;
	category: string;
	date: string;
	time?: string;
	venue?: string;
	meetLink?: string;
	image: string;
	description: string;
}

const categories = ["All", "Paradox", "Workshops", "Meetups", "Other Events"];

export default function EventsPage() {
	const [currentEventIndex, setCurrentEventIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
	const [pastEventsData, setPastEventsData] = useState<Event[]>([]);
	const [visibleCount, setVisibleCount] = useState<{[key: string]: number}>({
		"Paradox": 8,
		"Workshops": 8,
		"Meetups": 8,
		"Other Events": 8
	});
	const [collapseTimers, setCollapseTimers] = useState<{[key: string]: NodeJS.Timeout}>({});
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const upcomingQuery = query(collection(db, 'events'), where('type', '==', 'upcoming'), where('status', '==', 'active'));
				const pastQuery = query(collection(db, 'events'), where('type', '==', 'past'), where('status', '==', 'active'));
				
				const [upcomingSnap, pastSnap] = await Promise.all([
					getDocs(upcomingQuery),
					getDocs(pastQuery)
				]);

				const upcoming = upcomingSnap.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
					image: doc.data().imageUrl
				})) as Event[];

				const past = pastSnap.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
					image: doc.data().imageUrl
				})) as Event[];

				if (upcoming.length > 0) setUpcomingEvents(upcoming.sort((a, b) => ((a as Event & {order: number}).order || 0) - ((b as Event & {order: number}).order || 0)));
				if (past.length > 0) setPastEventsData(past.sort((a, b) => ((a as Event & {order: number}).order || 0) - ((b as Event & {order: number}).order || 0)));
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		};
		fetchEvents();
	}, []);

	useEffect(() => {
		if (upcomingEvents.length === 0) return;
		const timer = setInterval(() => {
			setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [upcomingEvents.length]);

	const nextEvent = () => {
		setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
	};

	const prevEvent = () => {
		setCurrentEventIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
	};

	const currentEvent = upcomingEvents[currentEventIndex];

	useEffect(() => {
		document.querySelectorAll('footer').forEach((f) => {
			if (!f.hasAttribute('data-events-footer')) {
				try {
					(f as HTMLElement).style.display = 'none';
					f.setAttribute('data-invisible-for-events', 'true');
				} catch {}
			}
		});

		return () => {
			document.querySelectorAll('footer[data-invisible-for-events]').forEach((f) => {
				try {
					(f as HTMLElement).style.display = '';
					f.removeAttribute('data-invisible-for-events');
				} catch {}
			});
		};
	}, []);

	const hasUpcomingEvents = upcomingEvents.length > 0;

	return (
		<div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
			<section className="relative overflow-hidden bg-black">
				<div className="absolute inset-0">
					<Image src="/events-hero-bg.svg" alt="Hero background" fill className="object-cover" priority />
				</div>
				<div className="relative z-10 py-20 px-6 md:px-8 lg:px-12 pt-32">
					<div className="max-w-[1400px] mx-auto text-center">
						<h1 className="text-4xl sm:text-[3rem] md:text-[3.5rem] lg:text-6xl xl:text-[4rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-title font-medium text-transparent leading-[1.1] tracking-tight">
							Events & Workshops
						</h1>
						<p className="mt-6 text-sm md:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto">
							Join our exciting events, workshops, and learning sessions. Connect, learn, and grow.
						</p>
					</div>
				</div>
			</section>

			<main className="relative z-10 px-6 md:px-8 lg:px-12 py-16">
				<div className="max-w-[1200px] mx-auto">
					<div className="mb-20">
						<h2 className="text-3xl md:text-4xl font-title font-medium mb-3 text-gray-800">Upcoming Events</h2>
						<p className="text-gray-600 text-sm md:text-base mb-8 max-w-2xl">Join us for exciting upcoming events and workshops.</p>

						{!hasUpcomingEvents ? (
							<div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
								<svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
								<p className="text-gray-600">Check back soon for new events and workshops!</p>
							</div>
						) : (
							<div className="relative">
							<div className="hidden md:flex items-center gap-4">
								<button onClick={prevEvent} className="flex-shrink-0 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all" aria-label="Previous event">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
								</button>

								<div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
									<div className="flex h-[280px]">
										<div className="w-2/5 relative">
											<Image src={currentEvent.image} alt={currentEvent.title} fill className="object-cover" />
										</div>
										<div className="w-3/5 p-6 flex flex-col justify-between">
											<div>
												<h3 className="text-2xl font-semibold text-gray-900 mb-3">{currentEvent.title}</h3>
												<p className="text-gray-600 text-sm mb-4 line-clamp-2">{currentEvent.description}</p>
											</div>
											<div className="space-y-2">
												<div className="flex items-center gap-3 text-sm text-gray-700">
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
													<span>{currentEvent.date} • {currentEvent.time}</span>
												</div>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2 text-sm text-gray-700">
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
														<span>{currentEvent.venue}</span>
													</div>
													{currentEvent.meetLink && (
														<a href={`https://${currentEvent.meetLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
															Join Google Meet
														</a>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								<button onClick={nextEvent} className="flex-shrink-0 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all" aria-label="Next event">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
								</button>
							</div>

							<div className="md:hidden">
								<div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
									<div className="relative h-48">
										<Image src={currentEvent.image} alt={currentEvent.title} fill className="object-cover" />
									</div>
									<div className="p-4 space-y-3">
										<h3 className="text-xl font-semibold text-gray-900">{currentEvent.title}</h3>
										<p className="text-gray-600 text-sm line-clamp-2">{currentEvent.description}</p>
										<div className="space-y-2">
											<div className="flex items-center gap-2 text-sm text-gray-700">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
												<span>{currentEvent.date} • {currentEvent.time}</span>
											</div>
											<div className="flex items-center gap-2 text-sm text-gray-700">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
												<span>{currentEvent.venue}</span>
											</div>
											{currentEvent.meetLink && (
												<a href={`https://${currentEvent.meetLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
													Join Google Meet
												</a>
											)}
										</div>
									</div>
								</div>

								<div className="flex justify-center items-center gap-4 mt-4">
									<button onClick={prevEvent} className="w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
									</button>
									<div className="text-gray-700 text-sm font-medium">{currentEventIndex + 1} of {upcomingEvents.length}</div>
									<button onClick={nextEvent} className="w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
									</button>
								</div>
							</div>

							<div className="flex justify-center mt-6 gap-2">
								{upcomingEvents.map((_, index) => (
									<button key={index} onClick={() => setCurrentEventIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentEventIndex ? 'bg-gray-800 w-6' : 'bg-gray-400'}`} />
								))}
							</div>
						</div>
						)}
					</div>

					<div>
						<h2 className="text-3xl md:text-4xl font-title font-medium mb-3 text-gray-800">Past Events</h2>
						<p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl">Explore our previous events and workshops.</p>

						{pastEventsData.length === 0 ? (
							<div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
								<svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Events</h3>
								<p className="text-gray-600">Past events will appear here once they&apos;re completed.</p>
							</div>
						) : (
							<>
							<div className="flex flex-wrap justify-center gap-3 mb-8">
							{categories.map((category) => (
								<button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedCategory === category ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm'}`}>
									{category}
								</button>
							))}
						</div>

						{selectedCategory === "All" ? (
							<div className="space-y-12">
								{categories.slice(1).map((category) => {
									const categoryEvents = pastEventsData.filter(e => e.category === category);
									const currentVisible = visibleCount[category] || 8;
									const displayedEvents = categoryEvents.slice(0, currentVisible);
									const hasMore = categoryEvents.length > currentVisible;
									const isExpanded = currentVisible > 8;
									const remainingCount = categoryEvents.length - currentVisible;

									if (categoryEvents.length === 0) return null;

									return (
										<div key={category}>
											<div className="flex items-center gap-4 mb-6">
												<h3 className="text-2xl font-semibold text-gray-800 whitespace-nowrap">{category} Events</h3>
												<div className="flex-1 h-px bg-gray-300"></div>
											</div>
											<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
												{displayedEvents.map((event) => (
													<article key={event.id} onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }} className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
														<div className="relative w-full aspect-[3/4]">
															<Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
														</div>
														<div className="p-3 md:p-4 space-y-1.5">
															<div className="text-xs text-gray-500 font-medium">{event.date}</div>
															<h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">{event.title}</h3>
															<p className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">{event.description}</p>
														</div>
													</article>
												))}
											</div>
											<div className="flex justify-center gap-3 mt-6">
												{hasMore && (
													<button onClick={() => { 
														if (collapseTimers[category]) clearTimeout(collapseTimers[category]);
														setVisibleCount(prev => ({...prev, [category]: currentVisible + 8})); 
														const timer = setTimeout(() => { setVisibleCount(prev => ({...prev, [category]: 8})); }, 60000);
														setCollapseTimers(prev => ({...prev, [category]: timer}));
													}} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium">
														Load More {remainingCount > 0 && `(${remainingCount} remaining)`}
													</button>
												)}
												{isExpanded && (
													<button onClick={() => { 
														if (collapseTimers[category]) clearTimeout(collapseTimers[category]);
														setVisibleCount(prev => ({...prev, [category]: 8})); 
													}} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium">
														Show Less
													</button>
												)}
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div>
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
									{pastEventsData.filter(e => e.category === selectedCategory).slice(0, visibleCount[selectedCategory] || 8).map((event) => (
										<article key={event.id} onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }} className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
											<div className="relative w-full aspect-[3/4]">
												<Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
											</div>
											<div className="p-3 md:p-4 space-y-1.5">
												<div className="text-xs text-gray-500 font-medium">{event.date}</div>
												<h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">{event.title}</h3>
												<p className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">{event.description}</p>
											</div>
										</article>
									))}
								</div>
								{(() => {
									const filteredEvents = pastEventsData.filter(e => e.category === selectedCategory);
									const currentVisible = visibleCount[selectedCategory] || 8;
									const hasMore = filteredEvents.length > currentVisible;
									const isExpanded = currentVisible > 8;
									const remainingCount = filteredEvents.length - currentVisible;
									return (
										<div className="flex justify-center gap-3 mt-6">
											{hasMore && (
												<button onClick={() => { 
													if (collapseTimers[selectedCategory]) clearTimeout(collapseTimers[selectedCategory]);
													setVisibleCount(prev => ({...prev, [selectedCategory]: currentVisible + 8})); 
													const timer = setTimeout(() => { setVisibleCount(prev => ({...prev, [selectedCategory]: 8})); }, 60000);
													setCollapseTimers(prev => ({...prev, [selectedCategory]: timer}));
												}} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium">
													Load More {remainingCount > 0 && `(${remainingCount} remaining)`}
												</button>
											)}
											{isExpanded && (
												<button onClick={() => { 
													if (collapseTimers[selectedCategory]) clearTimeout(collapseTimers[selectedCategory]);
													setVisibleCount(prev => ({...prev, [selectedCategory]: 8})); 
												}} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium">
													Show Less
												</button>
											)}
										</div>
									);
								})()}
							</div>
						)}
						</>
						)}
					</div>
				</div>
			</main>

			<EventFooter />

			{/* Event Details Modal */}
			{isModalOpen && selectedEvent && (
				<div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto'>
					<div className='bg-black/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-white max-w-4xl w-full relative overflow-hidden my-auto'>
						<button onClick={() => setIsModalOpen(false)} className='absolute top-4 right-4 z-20 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg px-4 py-2 text-xl transition-colors'>
							×
						</button>
						
						{/* Mobile: Background with poster */}
						<div className='md:hidden absolute inset-0 z-0'>
							<Image src={selectedEvent.image} alt={selectedEvent.title} fill className='object-cover opacity-20' />
						</div>
						
						{/* Desktop: Two column layout */}
						<div className='flex flex-col md:flex-row gap-6 relative z-10'>
							{/* Left side - Poster (Desktop only) */}
							<div className='hidden md:flex md:w-1/2 flex-col'>
								<div className='relative w-full aspect-[3/4] rounded-xl overflow-hidden'>
									<Image src={selectedEvent.image} alt={selectedEvent.title} fill className='object-cover' />
								</div>
							</div>
							
							{/* Right side - Content */}
							<div className='md:w-1/2 flex flex-col py-4 md:py-0'>
								<h3 className='text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg'>{selectedEvent.title}</h3>
								
								<div className='space-y-3 mb-4'>
									<div className='flex items-center gap-2 text-sm text-white/90'>
										<svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg>
										<span className='font-medium'>{selectedEvent.date}{selectedEvent.time && ` • ${selectedEvent.time}`}</span>
									</div>
									
									{selectedEvent.venue && (
										<div className='flex items-center gap-2 text-sm text-white/90'>
											<svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
											<span className='font-medium'>{selectedEvent.venue}</span>
										</div>
									)}
									
									<div className='flex items-center gap-2 text-sm text-white/90'>
										<svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' /></svg>
										<span className='font-medium'>{selectedEvent.category}</span>
									</div>
								</div>
								
								<div className='border-t border-white/20 pt-4 mb-4'>
									<h4 className='text-lg font-semibold text-white mb-2'>Description</h4>
									<p className='text-white/90 text-sm md:text-base leading-relaxed drop-shadow-md'>{selectedEvent.description}</p>
								</div>
								
								{selectedEvent.meetLink && (
									<div className='mt-auto pt-4'>
										<a href={`https://${selectedEvent.meetLink}`} target='_blank' rel='noopener noreferrer' className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors w-full font-medium'>
											<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' /></svg>
											Join Google Meet
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import EventFooter from "@/components/EventFooter";

// Mock data for events - this will be replaced with API calls later
const eventsData = [
	{
		id: 1,
		title: "DevEx 101: Developer Experience Explained",
		category: "Insights",
		date: "Feb 5, 2025",
		image: "/devansh.jpeg",
		description:
			"Learn about the fundamentals of developer experience and how to improve it in your organization.",
		tags: ["Developer Experience", "DevEx", "Best Practices"],
	},
	{
		id: 2,
		title: "Assertions in Dart and Flutter tests: an ultimate cheat sheet",
		category: "Flutter",
		date: "Feb 2, 2023",
		image: "/devansh.jpeg",
		description:
			"A comprehensive guide to testing in Flutter applications with practical examples.",
		tags: ["Flutter", "Testing", "Dart"],
	},
	{
		id: 3,
		title: "Sending emails using Firestore and Firebase Extensions",
		category: "Firebase",
		date: "Oct 6, 2022",
		image: "/devansh.jpeg",
		description:
			"How to implement email functionality using Firebase Extensions and Firestore.",
		tags: ["Firebase", "Firestore", "Email"],
	},
	{
		id: 4,
		title: "React Native Firebase Roadmap: TurboModules Migration",
		category: "React Native",
		date: "Aug 27, 2025",
		image: "/devansh.jpeg",
		description:
			"Discover the future of React Native Firebase with TurboModules integration.",
		tags: ["React Native", "Firebase", "TurboModules"],
	},
	{
		id: 5,
		title: "Enable Genkit Monitoring in Your Firebase Gemini Chatbot",
		category: "Firebase",
		date: "Jul 2, 2025",
		image: "/devansh.jpeg",
		description:
			"Learn how to implement monitoring for your AI-powered chatbot applications.",
		tags: ["Firebase", "AI", "Monitoring", "Gemini"],
	},
	{
		id: 6,
		title: "Cloud Functions Streaming in Flutter",
		category: "Flutter",
		date: "Jun 11, 2025",
		image: "/devansh.jpeg",
		description:
			"Implement real-time streaming with Cloud Functions in your Flutter applications.",
		tags: ["Flutter", "Cloud Functions", "Streaming"],
	},
	{
		id: 7,
		title: "Migrating Flutter Plugins to Pigeon: Lessons Learned",
		category: "Flutter",
		date: "Apr 8, 2025",
		image: "/devansh.jpeg",
		description:
			"Best practices and lessons learned from migrating Flutter plugins to Pigeon.",
		tags: ["Flutter", "Pigeon", "Migration"],
	},
	{
		id: 8,
		title: "Making Documentation Easy for Widgetbook with docs.page",
		category: "Success Stories",
		date: "Feb 26, 2025",
		image: "/devansh.jpeg",
		description:
			"How docs.page empowers Widgetbook to focus entirely on content for their documentation.",
		tags: ["Documentation", "Widgetbook", "Tools"],
	},
	{
		id: 9,
		title: "Canonical Embraces Flutter, Guided by Invertase",
		category: "Success Stories",
		date: "Dec 19, 2024",
		image: "/devansh.jpeg",
		description:
			"How Canonical collaborated with Invertase to modernise core Ubuntu apps with Flutter.",
		tags: ["Flutter", "Ubuntu", "Canonical"],
	},
	{
		id: 10,
		title: "Migrating Flutter Plugins to Pigeon: Lessons Learned",
		category: "Flutter",
		date: "Apr 8, 2025",
		image: "/devansh.jpeg",
		description:
			"Best practices and lessons learned from migrating Flutter plugins to Pigeon.",
		tags: ["Flutter", "Pigeon", "Migration"],
	},
	{
		id: 11,
		title: "Migrating Flutter Plugins to Pigeon: Lessons Learned",
		category: "Flutter",
		date: "Apr 8, 2025",
		image: "/devansh.jpeg",
		description:
			"Best practices and lessons learned from migrating Flutter plugins to Pigeon.",
		tags: ["Flutter", "Pigeon", "Migration"],
	},
];

export default function EventsPage() {
	const [currentEventIndex, setCurrentEventIndex] = useState(0);
	const [visiblePastEvents, setVisiblePastEvents] = useState(2)
	const [categories, setCategories] = useState<string[] | null>(null)

	useEffect(() => {
		const categories: string[] = []
		eventsData.map((event) => {
			// console.log(categories.filter((cat) => cat==event.category).length)
			if (categories.filter((cat: string) => cat == event.category).length == 0) {
				categories.push(event.category)
			}
		})
		setCategories(categories)
	}, [])

	// Upcoming events data
	const upcomingEvents = [
		{
			id: 1,
			title: "DevEx 101: Developer Experience Workshop",
			description: "Learn the fundamentals of developer experience and how to improve it in your organization. This comprehensive workshop covers best practices, tools, and methodologies.",
			image: "/devansh.jpeg",
			date: "Feb 15, 2025 • 2:00 PM",
			venue: "Conference Hall A, Main Building",
			tags: [
				{ name: "Productivity", color: "bg-blue-600" },
				{ name: "Workshop", color: "bg-orange-600" }
			]
		},
		{
			id: 2,
			title: "Flutter Testing Masterclass",
			description: "Master testing in Flutter applications with comprehensive examples, best practices, and hands-on exercises covering unit, widget, and integration tests.",
			image: "/devansh.jpeg",
			date: "Feb 22, 2025 • 3:00 PM",
			venue: "Lab 201, Computer Science Building",
			tags: [
				{ name: "Flutter", color: "bg-blue-500" },
				{ name: "Testing", color: "bg-purple-600" }
			]
		},
		{
			id: 3,
			title: "Firebase Extensions Workshop",
			description: "Build powerful backends with Firebase Extensions. Learn to integrate authentication, cloud functions, and real-time databases in your applications.",
			image: "/devansh.jpeg",
			date: "Mar 1, 2025 • 4:00 PM",
			venue: "Innovation Hub, Block C",
			tags: [
				{ name: "Firebase", color: "bg-orange-500" },
				{ name: "Backend", color: "bg-red-600" }
			]
		}
	];

	// Auto-advance functionality
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
		}, 5000); // Auto-advance every 5 seconds

		return () => clearInterval(timer);
	}, [upcomingEvents.length]);

	// Navigation functions
	const nextEvent = () => {
		setCurrentEventIndex((prev) => (prev + 1) % upcomingEvents.length);
	};

	const prevEvent = () => {
		setCurrentEventIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
	};

	const currentEvent = upcomingEvents[currentEventIndex];

	// Remove global footer on mount for this page
	useEffect(() => {
		document.querySelectorAll('footer').forEach((f) => {
			if (!f.hasAttribute('data-events-footer')) {
				// hide the footer instead of removing it to avoid breaking React/Next insertBefore operations
				try {
					(f as HTMLElement).style.display = 'none';
					f.setAttribute('data-invisible-for-events', 'true');
				} catch {
					// ignore
				}
			}
		});

		return () => {
			// restore any hidden footers when unmounting
			document.querySelectorAll('footer[data-invisible-for-events]').forEach((f) => {
				try {
					(f as HTMLElement).style.display = '';
					f.removeAttribute('data-invisible-for-events');
				} catch {
					// ignore
				}
			});
		};
	}, []);

	// Filter events based on search and category




	return (
		<div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
			{/* Hero Background SVG - positioned like council page */}
			<div className="absolute left-1/2 top-0 w-[2842px] h-[480px] max-w-none -translate-x-1/2 overflow-hidden">
				<Image
					src="/events-hero-bg.svg"
					alt="Events hero background"
					width={2842}
					height={480}
					className="w-[2842px] h-[480px] max-w-none object-cover"
					priority
				/>
			</div>

			{/* Navbar */}
			<div className="relative z-20 text-white">
				<Navbar />
			</div>

			{/* Hero Section - large centered heading over bg */}
			<section className="relative z-10">
				<div className="absolute -top-6 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[480px] flex items-center justify-center px-6">
					<div className="relative w-full h-full flex items-center justify-center">
						{/* Text content */}
						<div className="text-center px-4">
							<h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
								Events & Workshops
							</h1>

							<p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
								Join our exciting events, workshops, and learning sessions. Connect, learn, and grow with the community.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<main className="relative z-10 px-6 md:px-8 lg:px-12 pt-[480px] pb-32">
				<div className="max-w-[1200px] mx-auto pt-16 relative">
					{/* ensure content stacks above gradients */}
					<div className="relative z-10">
						{/* Header - rebranded as Upcoming Events */}
						<div className="mb-12">
							<h1 className="text-[2rem] md:text-[2.5rem] font-bold mb-4 leading-[1.1] text-left">
								Upcoming Events
							</h1>
							<p className="text-gray-400 text-base text-left max-w-xl">
								Join us for exciting upcoming events and workshops.
							</p>
						</div>

						{/* Upcoming Events - responsive single card with navigation */}
						<div className="relative mb-16">
							{/* Desktop & Tablet Layout */}
							<div className="hidden md:flex items-center gap-4">
								{/* Previous Button */}
								<button
									onClick={prevEvent}
									className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-gray-800/50 hover:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-600/30"
									aria-label="Previous event"
								>
									<svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								</button>

								{/* Event Card - Desktop/Tablet */}
								<div className="flex-1 group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
									<div className="relative w-full h-[280px] lg:h-[320px] xl:h-[360px] rounded-[20px] lg:rounded-[24px] overflow-hidden">
										{/* Background SVG from council page */}
										<div className="absolute inset-0">
											<Image
												src="/council-card-bg.svg"
												alt="Card background"
												width={1000}
												height={360}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Card Content - Horizontal Layout */}
										<div className="relative z-10 h-full flex">
											{/* Left: Event Image */}
											<div className="w-[240px] lg:w-[320px] xl:w-[380px] flex-shrink-0 pl-0 pr-4 py-0 lg:pr-6">
												<div className="w-full h-full overflow-hidden shadow-xl">
													<Image
														src={currentEvent.image}
														alt={`${currentEvent.title} Poster`}
														width={380}
														height={300}
														className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</div>
											</div>

											{/* Right: Event Details */}
											<div className="flex-1 p-4 lg:p-6 xl:p-8 flex flex-col justify-between">
												<div className="space-y-3 lg:space-y-4">
													{/* Title */}
													<h3 className="text-white text-lg lg:text-2xl xl:text-3xl font-bold leading-tight">
														{currentEvent.title}
													</h3>
													
													{/* Description */}
													<p className="text-gray-300 text-sm lg:text-base xl:text-lg leading-relaxed line-clamp-3 lg:line-clamp-none">
														{currentEvent.description}
													</p>
													
													{/* Venue */}
													<p className="text-gray-400 text-sm lg:text-base flex items-center">
														<svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
														</svg>
														{currentEvent.venue}
													</p>
												</div>
												
												{/* Bottom Section: Tags and Date */}
												<div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 lg:gap-4 mt-4 lg:mt-6">
													{/* Category Tags */}
													<div className="flex gap-2 lg:gap-3 flex-wrap">
														{currentEvent.tags.map((tag, index) => (
															<span key={index} className={`inline-block px-2 lg:px-3 xl:px-4 py-1 lg:py-2 ${tag.color} text-white text-xs lg:text-sm font-medium rounded-full`}>
																{tag.name}
															</span>
														))}
													</div>
													
													{/* Date/Time */}
													<div className="text-[#9AE634] text-sm lg:text-base font-semibold flex items-center">
														<svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
														</svg>
														{currentEvent.date}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Next Button */}
								<button
									onClick={nextEvent}
									className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-gray-800/50 hover:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-600/30"
									aria-label="Next event"
								>
									<svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>

							{/* Mobile Layout */}
							<div className="md:hidden">
								{/* Mobile Event Card */}
								<div className="group cursor-pointer transform transition-all duration-500 active:scale-[0.98]">
									<div className="relative w-full h-[500px] rounded-[16px] overflow-hidden">
										{/* Background SVG from council page */}
										<div className="absolute inset-0">
											<Image
												src="/council-card-bg.svg"
												alt="Card background"
												width={400}
												height={500}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Card Content - Vertical Layout for Mobile */}
										<div className="relative z-10 h-full flex flex-col">
											{/* Event Image */}
											<div className="w-full h-[280px] overflow-hidden shadow-xl">
												<Image
													src={currentEvent.image}
													alt={`${currentEvent.title} Poster`}
													width={350}
													height={280}
													className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
												/>
											</div>

											{/* Event Details */}
											<div className="flex-1 p-4 space-y-3">
												{/* Title */}
												<h3 className="text-white text-xl font-bold leading-tight">
													{currentEvent.title}
												</h3>
												
												{/* Description */}
												<p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
													{currentEvent.description}
												</p>
												
												{/* Venue */}
												<p className="text-gray-400 text-sm flex items-center">
													<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
													</svg>
													{currentEvent.venue}
												</p>
												
												{/* Category Tags */}
												<div className="flex gap-2 flex-wrap">
													{currentEvent.tags.map((tag, index) => (
														<span key={index} className={`inline-block px-3 py-1 ${tag.color} text-white text-xs font-medium rounded-full`}>
															{tag.name}
														</span>
													))}
												</div>
												
												{/* Date/Time */}
												<div className="text-[#9AE634] text-sm font-semibold flex items-center pt-2">
													<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
													{currentEvent.date}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Mobile Navigation Buttons */}
								<div className="flex justify-center items-center gap-4 mt-4">
									<button
										onClick={prevEvent}
										className="w-10 h-10 bg-gray-800/50 active:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 backdrop-blur-sm border border-gray-600/30"
										aria-label="Previous event"
									>
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
										</svg>
									</button>

									{/* Make counter text dark on light background */}
									<div className="text-black text-sm font-medium">
										{currentEventIndex + 1} of {upcomingEvents.length}
									</div>

									<button
										onClick={nextEvent}
										className="w-10 h-10 bg-gray-800/50 active:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 backdrop-blur-sm border border-gray-600/30"
										aria-label="Next event"
									>
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</div>
							</div>

							{/* Event Indicators - Hidden on Mobile, Visible on Desktop */}
							<div className="hidden md:flex justify-center mt-6 gap-2">
								{upcomingEvents.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentEventIndex(index)}
										className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
											index === currentEventIndex 
												? 'bg-[#9AE634] scale-125' 
												: 'bg-gray-600 hover:bg-gray-500'
										}`}
										aria-label={`Go to event ${index + 1}`}
									/>
								))}
							</div>
						</div>
						{/* Insights Section - rebranded from blog posts */}
						<div className="mb-8">
							<h2 className="text-[2rem] md:text-[2.5rem] font-bold mb-4 leading-[1.1] text-left">
								Past Events
							</h2>
							<p className="text-gray-400 text-base text-left max-w-xl">
								Get the latest news and updates from the Invertase team.
							</p>
						</div>

						{/* Bottom Grid - additional events from the filtered data */}
						<div className="flex flex-col">
							{categories && categories.slice(0, visiblePastEvents).map((category) => {
								// filter specific category events
								const catEvents = eventsData.filter((event) => event.category == category)

								// checks whether the cards are overflowing and have to show the scroll buttons
								const el = document.getElementById(category);
								const isOverflowing = el && el.scrollWidth > el.clientWidth;

								return (catEvents.length > 0 && (
									<div key={category} className="flex flex-col gap-2">
										<h3 className="text-[1.2rem] font-semibold md:text-xl ml-6 md:ml-14">{category}</h3>
										<div className="flex items-center">
											<button onClick={() => document.getElementById(category)?.scrollBy({ left: -200, behavior: 'smooth' })} className="w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 relative bg-gray-800/50 hover:bg-gray-700/70 hover:scale-110 rounded-full flex justify-center items-center shrink-0 cursor-pointer transition-all duration-300 border border-gray-600/30" style={{ visibility: isOverflowing ? 'visible' : 'hidden' }}>
												<svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
												</svg>
											</button>
											<div id={`${category}`} className="flex overflow-x-hidden scroll-smooth md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 sm:mx-2 py-3 px-2">
												{catEvents.map((event) => {
													return (
														// Past Event Card
														<article key={event.id} className="group cursor-pointer shrink-0 w-48 md:w-52 lg:w-60 relative border flex flex-col items-center py-3 justify-between px-3 border-gray-700 rounded-2xl transition-all duration-500 hover:scale-105">
															<Image
																src={"/devansh.jpeg"}
																alt={`${event.title} Poster`}
																width={250}
																height={180}
																className="w-full h-40 md:h-44 lg:h-52 object-cover rounded-xl"
															/>
															<div className="space-y-2 mr-5 my-4 md:mr-2">
																<div className="flex flex-col items-start gap-2">
																	<div className="text-gray-500 text-xs">
																		{event.date}
																	</div>
																</div>
																<h3 className="text-sm md:text-base lg:text-lg text-black transition-colors leading-tight">
																	{event.title}
																</h3>
															</div>
															</article>
														)
													})}
											</div>
											<button onClick={() => document.getElementById(category)?.scrollBy({ left: 200, behavior: 'smooth' })} className="w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 relative bg-gray-800/50 hover:bg-gray-700/70 hover:scale-110 rounded-full flex justify-center items-center shrink-0 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-gray-600/30" style={{ visibility: isOverflowing ? 'visible' : 'hidden' }}>
												<svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</button>
										</div>
									</div>

								))
							})}
							{categories && <button className="border text-sm md:text-base lg:text-lg border-gray-700 rounded-xl w-fit px-3 py-1 mx-auto transition-all duration-300 hover:scale-105 hover:bg-gray-700/70" onClick={() => visiblePastEvents <= categories.length ? setVisiblePastEvents(prev => prev + 2) : setVisiblePastEvents(2)}>{visiblePastEvents <= categories.length ? "Show More" : "Show Less"}</button>}
						</div>
					</div>
				</div>
			</main>

			{/* Custom Event Footer */}
			<EventFooter />
		</div>
	);
}

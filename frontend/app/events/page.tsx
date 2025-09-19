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
];

const categories = [
	"All Posts",
	"Community",
	"Dart",
	"Firebase",
	"Flutter",
	"Globe",
	"More",
];

export default function EventsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Posts");
	const [currentPage, setCurrentPage] = useState(1);
	const [currentEventIndex, setCurrentEventIndex] = useState(0);
	const itemsPerPage = 6;

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
				} catch (e) {
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
				} catch (e) {
					// ignore
				}
			});
		};
	}, []);

	// Filter events based on search and category
	const filteredEvents = eventsData.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);

		const matchesCategory =
			selectedCategory === "All Posts" ||
			event.category.toLowerCase() === selectedCategory.toLowerCase();

		return matchesSearch && matchesCategory;
	});

	// Calculate pagination
	const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedEvents = filteredEvents.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden">
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
			<div className="relative z-20">
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
			<main className="relative z-10 px-6 md:px-8 lg:px-12 pt-[480px]">
				<div className="max-w-[1200px] mx-auto pt-16 relative">
					{/* Decorative left/right background gradients for Upcoming & Past events */}
					<div className="absolute inset-0 z-0 pointer-events-none">
						{/* Left gradient */}
						<span className="absolute left-[-120px] top-20 h-[600px] w-[550px] rotate-[-35deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(47,50,62,0.70)_2%,rgba(36,39,48,0.40)_41.5%,rgba(36,39,48,0.00)_90%)] blur-[100px]"></span>
						{/* Right gradient */}
						<span className="absolute right-[-150px] top-0 h-[450px] w-[900px] rotate-[-21deg] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(27,46,48,0.80)_0%,rgba(20,32,41,0.40)_44%,rgba(20,32,41,0.00)_96.5%)] blur-[40px]"></span>
					</div>

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

						{/* Upcoming Events - single horizontal card with navigation */}
						<div className="relative mb-16">
							{/* Navigation Container */}
							<div className="flex items-center gap-4">
								{/* Previous Button */}
								<button
									onClick={prevEvent}
									className="flex-shrink-0 w-12 h-12 bg-gray-800/50 hover:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-600/30"
									aria-label="Previous event"
								>
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								</button>

								{/* Event Card */}
								<div className="flex-1 group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
									<div className="relative w-full h-[280px] md:h-[320px] rounded-[24px] overflow-hidden">
										{/* Background SVG from council page */}
										<div className="absolute inset-0">
											<Image
												src="/council-card-bg.svg"
												alt="Card background"
												width={1000}
												height={320}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Card Content - Horizontal Layout */}
										<div className="relative z-10 h-full flex">
											{/* Left: Event Image */}
											<div className="w-[320px] md:w-[380px] flex-shrink-0 p-6">
												<div className="w-full h-full rounded-[16px] overflow-hidden shadow-xl">
													<Image
														src={currentEvent.image}
														alt={`${currentEvent.title} Poster`}
														width={380}
														height={260}
														className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</div>
											</div>

											{/* Right: Event Details */}
											<div className="flex-1 p-8 flex flex-col justify-between">
												<div className="space-y-4">
													{/* Title */}
													<h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">
														{currentEvent.title}
													</h3>
													
													{/* Description */}
													<p className="text-gray-300 text-lg leading-relaxed">
														{currentEvent.description}
													</p>
													
													{/* Venue */}
													<p className="text-gray-400 text-base flex items-center">
														<svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
														</svg>
														{currentEvent.venue}
													</p>
												</div>
												
												{/* Bottom Section: Tags and Date */}
												<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
													{/* Category Tags */}
													<div className="flex gap-3 flex-wrap">
														{currentEvent.tags.map((tag, index) => (
															<span key={index} className={`inline-block px-4 py-2 ${tag.color} text-white text-sm font-medium rounded-full`}>
																{tag.name}
															</span>
														))}
													</div>
													
													{/* Date/Time */}
													<div className="text-[#9AE634] text-base font-semibold flex items-center">
														<svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
									className="flex-shrink-0 w-12 h-12 bg-gray-800/50 hover:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-600/30"
									aria-label="Next event"
								>
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</button>
							</div>

							{/* Event Indicators */}
							<div className="flex justify-center mt-6 gap-2">
								{upcomingEvents.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentEventIndex(index)}
										className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
						<div className="flex flex-col lg:flex-row gap-4 mb-10 items-start lg:items-center">
							{/* Category Filters - smaller button styling */}
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<button
										key={category}
										onClick={() => {
											setSelectedCategory(category);
											setCurrentPage(1);
										}}
										className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
											selectedCategory === category
												? "bg-orange-500 text-white border-orange-500"
												: "bg-transparent text-gray-300 border-gray-600 hover:border-gray-500 hover:text-white"
										}`}
									>
										{category}
									</button>
								))}
							</div>

							{/* Search Box - smaller size to match reference */}
							<div className="relative lg:ml-auto">
								<input
									type="text"
									placeholder="Search"
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										setCurrentPage(1);
									}}
									className="w-64 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors text-sm"
								/>
								<div className="absolute right-3 top-1/2 -translate-y-1/2">
									<kbd className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600">
										⌘K
									</kbd>
								</div>
							</div>
						</div>

						{/* Bottom Grid - additional events from the filtered data */}
						{paginatedEvents.length > 3 && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{paginatedEvents.slice(3).map((event) => (
									<article key={event.id} className="group cursor-pointer">
										<div className="relative rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-6 h-[200px]">
											{/* INVERTASE logo */}
											<div className="absolute top-4 right-4">
												<div className="text-gray-200 text-xs font-semibold opacity-80">
													INVERTASE
												</div>
											</div>

											{/* Centered title */}
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="text-center px-4">
													<h3 className="text-white text-lg font-bold leading-tight">
														{event.title}
													</h3>
												</div>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex flex-col items-start gap-2">
												{/* Category tag badge above date/time */}
												<div className="flex gap-2">
													<span className="inline-block px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
														{event.category}
													</span>
												</div>
												<div className="text-gray-500 text-sm">
													{event.date}
												</div>
											</div>
											<h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
												{event.title}
											</h3>
										</div>
									</article>
								))}
							</div>
						)}

						{/* Pagination - smaller and more compact */}
						<div className="flex items-center justify-center gap-3 mb-12">
							<button
								onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Previous
							</button>

							<div className="flex gap-1">
								{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
									const pageNum = i + 1;
									return (
										<button
											key={pageNum}
											onClick={() => setCurrentPage(pageNum)}
											className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
												currentPage === pageNum
													? "bg-orange-500 text-white"
													: "text-gray-400 hover:text-white hover:bg-gray-800/50"
											}`}
										>
											{pageNum}
										</button>
									);
								})}
								{totalPages > 5 && (
									<>
										<span className="text-gray-500 px-1 flex items-center text-sm">
											...
										</span>
										<button
											onClick={() => setCurrentPage(totalPages)}
											className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
												currentPage === totalPages
													? "bg-orange-500 text-white"
													: "text-gray-400 hover:text-white hover:bg-gray-800/50"
											}`}
										>
											{totalPages}
										</button>
									</>
								)}
							</div>

							<button
								onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
								disabled={currentPage === totalPages}
								className="flex items-center gap-2 px-3 py-1.5 text-orange-500 hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm"
							>
								Next
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</main>

			{/* Custom Event Footer */}
			<EventFooter />
		</div>
	);
}

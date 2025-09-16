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
	const itemsPerPage = 6;

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

						{/* Upcoming Events Grid - vertical cards with council-style backgrounds */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
							{/* First Event Card - DevEx Workshop */}
							<div className="group cursor-pointer">
								<div className="relative w-full max-w-[320px] mx-auto h-[450px] rounded-[20px] overflow-hidden transition-transform group-hover:scale-105">
									{/* Background SVG from council page */}
									<div className="absolute inset-0">
										<Image
											src="/council-card-bg.svg"
											alt="Card background"
											width={340}
											height={450}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Card Content with better layout */}
									<div className="relative z-10 h-full flex flex-col">
										{/* Event Poster/Image - better positioning */}
										<div className="p-6 pb-4">
											<div className="w-full h-64 rounded-[12px] overflow-hidden shadow-lg">
												<Image
													src="/devansh.jpeg"
													alt="DevEx Workshop Poster"
													width={320}
													height={256}
													className="w-full h-full object-cover"
												/>
											</div>
										</div>

										{/* Event Details - improved spacing and alignment */}
										<div className="px-6 pb-6 flex-1 flex flex-col justify-between">
											<div className="text-center space-y-3">
												{/* Title */}
												<h3 className="text-white text-lg font-bold leading-tight px-2">
													DevEx 101: Developer Experience Workshop
												</h3>
												
												{/* Description */}
												<p className="text-gray-300 text-sm leading-relaxed px-2">
													Learn the fundamentals of developer experience
												</p>
											</div>
											
											{/* Category Tags - moved to sit just above the Date/Time */}
											<div className="flex justify-center gap-2 flex-wrap mt-3">
												<span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
													Productivity
												</span>
												<span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full">
													Workshop
												</span>
											</div>
											
											{/* Date/Time - positioned at bottom */}
											<div className="text-center mt-4">
												<div className="text-[#9AE634] text-sm font-medium">
													Feb 15, 2025 • 2:00 PM
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Second Event Card - Flutter Testing */}
							<div className="group cursor-pointer">
								<div className="relative w-full max-w-[320px] mx-auto h-[450px] rounded-[20px] overflow-hidden transition-transform group-hover:scale-105">
									{/* Background SVG from council page */}
									<div className="absolute inset-0">
										<Image
											src="/council-card-bg.svg"
											alt="Card background"
											width={340}
											height={450}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Card Content with better layout */}
									<div className="relative z-10 h-full flex flex-col">
										{/* Event Poster/Image - better positioning */}
										<div className="p-6 pb-4">
											<div className="w-full h-64 rounded-[12px] overflow-hidden shadow-lg">
												<Image
													src="/devansh.jpeg"
													alt="Flutter Testing Workshop Poster"
													width={320}
													height={256}
													className="w-full h-full object-cover"
												/>
											</div>
										</div>

										{/* Event Details - improved spacing and alignment */}
										<div className="px-6 pb-6 flex-1 flex flex-col justify-between">
											<div className="text-center space-y-3">
												{/* Title */}
												<h3 className="text-white text-lg font-bold leading-tight px-2">
													Flutter Testing Masterclass
												</h3>
												
												{/* Description */}
												<p className="text-gray-300 text-sm leading-relaxed px-2">
													Master testing in Flutter applications
												</p>
											</div>
											
											{/* Category Tags - moved to sit just above the Date/Time */}
											<div className="flex justify-center gap-2 flex-wrap mt-3">
												<span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
													Flutter
												</span>
												<span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
													Testing
												</span>
											</div>
											
											{/* Date/Time - positioned at bottom */}
											<div className="text-center mt-4">
												<div className="text-[#9AE634] text-sm font-medium">
													Feb 22, 2025 • 3:00 PM
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Third Event Card - Firebase Workshop */}
							<div className="group cursor-pointer">
								<div className="relative w-full max-w-[320px] mx-auto h-[450px] rounded-[20px] overflow-hidden transition-transform group-hover:scale-105">
									{/* Background SVG from council page */}
									<div className="absolute inset-0">
										<Image
											src="/council-card-bg.svg"
											alt="Card background"
											width={340}
											height={450}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Card Content with better layout */}
									<div className="relative z-10 h-full flex flex-col">
										{/* Event Poster/Image - better positioning */}
										<div className="p-6 pb-4">
											<div className="w-full h-64 rounded-[12px] overflow-hidden shadow-lg">
												<Image
													src="/devansh.jpeg"
													alt="Firebase Workshop Poster"
													width={320}
													height={256}
													className="w-full h-full object-cover"
												/>
											</div>
										</div>

										{/* Event Details - improved spacing and alignment */}
										<div className="px-6 pb-6 flex-1 flex flex-col justify-between">
											<div className="text-center space-y-3">
												{/* Title */}
												<h3 className="text-white text-lg font-bold leading-tight px-2">
													Firebase Extensions Workshop
												</h3>
												
												{/* Description */}
												<p className="text-gray-300 text-sm leading-relaxed px-2">
													Build powerful backends with Firebase
												</p>
											</div>
											
											{/* Category Tags - moved to sit just above the Date/Time */}
											<div className="flex justify-center gap-2 flex-wrap mt-3">
												<span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
													Firebase
												</span>
												<span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
													Backend
												</span>
											</div>
											
											{/* Date/Time - positioned at bottom */}
											<div className="text-center mt-4">
												<div className="text-[#9AE634] text-sm font-medium">
													Mar 1, 2025 • 4:00 PM
												</div>
											</div>
										</div>
									</div>
								</div>
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

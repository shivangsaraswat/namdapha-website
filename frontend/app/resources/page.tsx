"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

// Projects data
const projectsData = [
  {
    id: 1,
    name: "react-native-firebase",
    description: "Integrate Firebase into your React Native app (iOS & Android)",
    stars: "12.1k",
    forks: "2.3k",
    contributors: 563,
    badge: "author",
    badgeColor: "bg-teal-100 text-teal-700"
  },
  {
    id: 2,
    name: "flutterfire",
    description: "Integrate Firebase into your Flutter app (iOS, Android & Web)",
    stars: "9k",
    forks: "4.1k", 
    contributors: 597,
    badge: "contributor",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 3,
    name: "firebase-ios-sdk",
    description: "The source code for the official iOS Firebase SDK.",
    stars: "6.4k",
    forks: "1.7k",
    contributors: 266,
    badge: "contributor", 
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 4,
    name: "firebase-tools",
    description: "The source code for official Firebase tooling.",
    stars: "4.2k",
    forks: "1.1k",
    contributors: 341,
    badge: "contributor",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 5,
    name: "genkit",
    description: "Build AI applications using the JavaScript or Go SDK.",
    stars: "3.2k",
    forks: "392",
    contributors: 108,
    badge: "contributor",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 6,
    name: "firebase-android-sdk",
    description: "The source code for the official Android Firebase SDK.",
    stars: "2.4k",
    forks: "642",
    contributors: 155,
    badge: "contributor",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 7,
    name: "notifee",
    description: "Add rich notifications to your React Native app",
    stars: "2.1k",
    forks: "258",
    contributors: 83,
    badge: "author",
    badgeColor: "bg-teal-100 text-teal-700"
  },
  {
    id: 8,
    name: "react-native-apple-authentication",
    description: "Implement Apple Authentication in your React Native app",
    stars: "1.5k",
    forks: "226",
    contributors: 50,
    badge: "author",
    badgeColor: "bg-teal-100 text-teal-700"
  },
  {
    id: 9,
    name: "melos",
    description: "Manage your Dart projects with multiple packages",
    stars: "1.4k",
    forks: "232",
    contributors: 137,
    badge: "author",
    badgeColor: "bg-teal-100 text-teal-700"
  }
];

const categories = [
  "All Projects",
  "Firebase", 
  "Dart",
  "iOS",
  "Flutter",
  "JavaScript",
  "React native",
  "More"
];

export default function ResourcesPage(){
  const [selectedCategory, setSelectedCategory] = useState<string>("All Projects");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter projects based on selected category and search
  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Background Pattern - same as council page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="container relative mx-auto h-full max-w-[1200px]">
          {/* Mobile background images */}
          <Image
            src="/bg2.svg"
            alt="Background pattern left"
            width={358}
            height={1702}
            className="absolute -top-7 left-[-304px] opacity-10 lg:hidden"
            priority
          />
          <Image
            src="/bg2.svg"
            alt="Background pattern right"
            width={358}
            height={1702}
            className="absolute bottom-0 right-[-320px] opacity-10 lg:hidden"
            priority
          />
          {/* Desktop background image */}
          <Image
            src="/bg2.svg"
            alt="Background pattern desktop"
            width={672}
            height={326}
            className="absolute right-0 top-0 opacity-10 hidden lg:block md:-right-8 md:-top-1.5 sm:top-2"
            priority
          />
        </div>
      </div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[40px] md:text-[48px] lg:text-[56px] font-bold text-gray-900 mb-6">
              Explore Resource Hub
            </h1>
          </div>
          
          {/* Search Bar and Filter Row */}
          <div className="flex items-center justify-between mb-6 gap-3">
            {/* Search Bar */}
            <div className="flex-1 lg:flex-initial lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex-shrink-0">
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[120px]">
                <option>Filter</option>
                <option>Firebase</option>
                <option>Flutter</option>
                <option>React Native</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-100 text-orange-600 border border-orange-200" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                {/* Header with name and star */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-[18px] font-semibold text-gray-900 leading-tight pr-2">
                    {project.name}
                  </h3>
                  <div className="flex items-center text-orange-500 flex-shrink-0">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[14px] font-medium">{project.stars}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-[14px] mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Footer with badge and stats */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded text-[12px] font-medium ${project.badgeColor}`}>
                    {project.badge}
                  </span>
                  <div className="flex items-center gap-4 text-gray-500 text-[13px]">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      {project.forks}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      {project.contributors}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-[14px]">
              Load more
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

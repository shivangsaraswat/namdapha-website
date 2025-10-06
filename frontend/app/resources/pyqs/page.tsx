"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

// Subject data organized by level
const subjectsByLevel: Record<string, string[]> = {
  "Foundation": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
  "Diploma": ["Engineering Mathematics", "Computer Science", "Electronics", "Mechanical", "Civil Engineering"],
  "BSc": ["Advanced Mathematics", "Quantum Physics", "Organic Chemistry", "Molecular Biology", "Statistics"],
  "BS": ["Research Methodology", "Advanced Physics", "Computational Mathematics", "Biochemistry", "Data Science"]
};

// PYQs data
const pyqsData = [
  {
    id: 1,
    subject: "Mathematics",
    level: "Foundation",
    term: "Quiz 1",
    year: "2024",
    downloadUrl: "#"
  },
  {
    id: 2,
    subject: "Physics",
    level: "Foundation",
    term: "Quiz 2",
    year: "2024",
    downloadUrl: "#"
  },
  {
    id: 3,
    subject: "Chemistry",
    level: "Foundation",
    term: "End Term",
    year: "2023",
    downloadUrl: "#"
  },
  {
    id: 4,
    subject: "Engineering Mathematics",
    level: "Diploma",
    term: "Quiz 1",
    year: "2024",
    downloadUrl: "#"
  },
  {
    id: 5,
    subject: "Computer Science",
    level: "Diploma",
    term: "End Term",
    year: "2023",
    downloadUrl: "#"
  },
  {
    id: 6,
    subject: "Advanced Mathematics",
    level: "BSc",
    term: "Quiz 2",
    year: "2024",
    downloadUrl: "#"
  },
  {
    id: 7,
    subject: "Quantum Physics",
    level: "BSc",
    term: "End Term",
    year: "2023",
    downloadUrl: "#"
  },
  {
    id: 8,
    subject: "Research Methodology",
    level: "BS",
    term: "Quiz 1",
    year: "2024",
    downloadUrl: "#"
  },
  {
    id: 9,
    subject: "Advanced Physics",
    level: "BS",
    term: "Quiz 2",
    year: "2024",
    downloadUrl: "#"
  }
];

const levels = ["Foundation", "Diploma", "BSc", "BS"];
const terms = ["Quiz 1", "Quiz 2", "End Term"];

export default function PYQsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("Foundation");
  const [selectedTerm, setSelectedTerm] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get subjects for the selected level
  const currentSubjects = subjectsByLevel[selectedLevel] || [];

  // Filter PYQs based on selected filters and search
  const filteredPYQs = pyqsData.filter((pyq) => {
    const matchesLevel = pyq.level === selectedLevel;
    const matchesTerm = selectedTerm === "All" || pyq.term === selectedTerm;
    const matchesSubject = selectedSubject === "All" || pyq.subject === selectedSubject;
    const matchesSearch = searchQuery === "" || 
      pyq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pyq.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pyq.year.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesTerm && matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Background Pattern - same as resources page */}
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
              Previous Year Questions
            </h1>
          </div>
          
          {/* Search Bar and Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by subject, term, or year..."
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

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Level Dropdown */}
              <select 
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedSubject("All"); // Reset subject when level changes
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[140px]"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {/* Term Dropdown */}
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[140px]"
              >
                <option value="All">All Terms</option>
                {terms.map((term) => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
            <button
              onClick={() => setSelectedSubject("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSubject === "All"
                  ? "bg-orange-100 text-orange-600 border border-orange-200" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              All Subjects
            </button>
            {currentSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubject === subject
                    ? "bg-orange-100 text-orange-600 border border-orange-200" 
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* PYQs Grid */}
          {filteredPYQs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredPYQs.map((pyq) => (
                <div key={pyq.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  {/* Header with subject name */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-[18px] font-semibold text-gray-900 leading-tight pr-2">
                      {pyq.subject}
                    </h3>
                    <div className="flex items-center text-orange-500 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600 text-[14px]">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Level:</span>
                      <span className="ml-1">{pyq.level}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-[14px]">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Term:</span>
                      <span className="ml-1">{pyq.term}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-[14px]">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Year:</span>
                      <span className="ml-1">{pyq.year}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg">No PYQs found matching your filters</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Load More Button - only show if there are results */}
          {filteredPYQs.length > 0 && (
            <div className="flex justify-center">
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-[14px]">
                Load more
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Download, Filter, FileText, Calendar, GraduationCap, BookOpen } from "lucide-react";
import { pyqService, PYQ } from "@/lib/pyqService";
import { useEffect } from "react";



export default function PYQsPage() {
  const [pyqsData, setPyqsData] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedTerm, setSelectedTerm] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableTerms, setAvailableTerms] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const data = await pyqService.getPublishedPYQs();
      setPyqsData(data);
      
      const allYears = ['2025', '2024', '2023', '2022', '2021'];
      setAvailableYears(allYears);
      
      const allSemesters = ['January', 'May', 'September'];
      setAvailableSemesters(allSemesters);
      
      const allLevels = ['Foundation', 'Diploma', 'BSc', 'BS'];
      setAvailableLevels(allLevels);
      
      const allTerms = ['Quiz 1', 'Quiz 2', 'End Term'];
      setAvailableTerms(allTerms);
      
      const subjects = [...new Set(data.map(p => p.subject))].sort();
      setAvailableSubjects(subjects);
    } catch (error) {
      console.error('Error fetching PYQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pyq: PYQ) => {
    if (pyq.id) {
      await pyqService.incrementDownloads(pyq.id);
    }
    window.open(pyq.fileUrl, '_blank');
  };

  const currentSubjects = selectedLevel === "All" 
    ? availableSubjects
    : [...new Set(pyqsData.filter(p => p.level === selectedLevel).map(p => p.subject))].sort();

  // Check if any filter is active
  const hasActiveFilters = selectedLevel !== "All" || selectedTerm !== "All" || 
    selectedSubject !== "All" || selectedYear !== "All" || 
    selectedSemester !== "All" || searchQuery !== "";

  // Filter PYQs based on selected filters and search
  let filteredPYQs = pyqsData.filter((pyq) => {
    const matchesLevel = selectedLevel === "All" || pyq.level === selectedLevel;
    const matchesTerm = selectedTerm === "All" || pyq.term === selectedTerm;
    const matchesSubject = selectedSubject === "All" || pyq.subject === selectedSubject;
    const matchesYear = selectedYear === "All" || pyq.year === selectedYear;
    const matchesSemester = selectedSemester === "All" || pyq.semester === selectedSemester;
    const matchesSearch = searchQuery === "" || 
      pyq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pyq.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pyq.year.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesTerm && matchesSubject && matchesYear && matchesSemester && matchesSearch;
  });

  if (!hasActiveFilters && filteredPYQs.length > 12) {
    const diversePYQs: PYQ[] = [];
    const usedCombinations = new Set<string>();
    
    for (const pyq of filteredPYQs) {
      const combo = `${pyq.subject}-${pyq.term}-${pyq.year}`;
      if (!usedCombinations.has(combo)) {
        diversePYQs.push(pyq);
        usedCombinations.add(combo);
        if (diversePYQs.length === 12) break;
      }
    }
    
    filteredPYQs = diversePYQs.length === 12 ? diversePYQs : filteredPYQs.slice(0, 12);
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
      </div>

      {/* Year Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">Year</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full bg-white border-2 border-gray-900">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[99999]">
            <SelectItem value="All">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">Degree Level</Label>
        <Select value={selectedLevel} onValueChange={(val) => {
          setSelectedLevel(val);
          setSelectedSubject("All");
        }}>
          <SelectTrigger className="w-full bg-white border-2 border-gray-900">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[99999]">
            <SelectItem value="All">All Levels</SelectItem>
            {availableLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">Subject</Label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full bg-white border-2 border-gray-900">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[99999] max-h-[300px]">
            <SelectItem value="All">All Subjects</SelectItem>
            {currentSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Term Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">Exam Type</Label>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-full bg-white border-2 border-gray-900">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[99999]">
            <SelectItem value="All">All Types</SelectItem>
            {availableTerms.map((term) => (
              <SelectItem key={term} value={term}>{term}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Semester Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">Term</Label>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-full bg-white border-2 border-gray-900">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[99999]">
            <SelectItem value="All">All Terms</SelectItem>
            {availableSemesters.map((semester) => (
              <SelectItem key={semester} value={semester}>{semester}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <Button 
        onClick={() => {
          setSelectedLevel("All");
          setSelectedTerm("All");
          setSelectedSubject("All");
          setSelectedYear("All");
          setSelectedSemester("All");
          setSearchQuery("");
        }}
        variant="outline"
        className="w-full border-2 border-gray-900 hover:bg-gray-100"
      >
        Reset Filters
      </Button>
    </div>
  );

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
              Previous Year Questions
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Access comprehensive collection of past exam papers to ace your preparation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <Card className="p-6 sticky top-24 border-2 border-gray-900 shadow-lg bg-white">
                <FilterSidebar />
              </Card>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Search Bar and Mobile Filter */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search by subject, term, or year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-6 text-base bg-white border-2 border-gray-900 focus:ring-2 focus:ring-orange-500"
                  />
                  <svg 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="lg:hidden bg-gray-900 hover:bg-gray-800 text-white px-6 py-6">
                      <Filter className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-white z-[9999]">
                    <SheetTitle>Filters</SheetTitle>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium">
                  Showing <span className="text-gray-900 font-bold">{filteredPYQs.length}</span> result{filteredPYQs.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* PYQs Grid */}
              {loading && <LoadingSpinner />}
              {!loading && filteredPYQs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPYQs.map((pyq) => (
                    <Card key={pyq.id} className="relative overflow-hidden border-2 border-gray-900 shadow-lg hover:shadow-xl transition-all group">
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="/councilbg.svg"
                          alt="Card background"
                          fill
                          className="object-cover opacity-90"
                        />
                      </div>
                      
                      <div className="relative z-10 p-6">
                        {/* Subject Title */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-white leading-tight pr-2">
                            {pyq.subject}
                          </h3>
                          <FileText className="w-6 h-6 text-white/80 flex-shrink-0" />
                        </div>

                        {/* Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-white/90 text-gray-900 hover:bg-white font-medium px-3 py-1">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {pyq.term}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-white/90 text-sm">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            <span className="font-medium">{pyq.level}</span>
                          </div>
                          
                          <div className="flex items-center text-white/90 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">{pyq.semester} {pyq.year}</span>
                          </div>
                        </div>

                        {/* Download Button */}
                        <Button 
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 shadow-md"
                          onClick={() => handleDownload(pyq)}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : !loading ? (
                <Card className="p-12 text-center border-2 border-gray-900 bg-white">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No PYQs Found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search query</p>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

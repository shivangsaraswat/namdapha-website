"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Download, Filter, FileText, Calendar, GraduationCap, BookOpen } from "lucide-react";
import { notesService, Note } from "@/lib/notesService";

export default function NotesPage() {
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getPublishedNotes();
      setNotesData(data);
      
      const allYears = ['2025', '2024', '2023', '2022', '2021'];
      setAvailableYears(allYears);
      
      const allLevels = ['Foundation', 'Diploma', 'BSc', 'BS'];
      setAvailableLevels(allLevels);
      
      const subjects = [...new Set(data.map(n => n.subject))].sort();
      setAvailableSubjects(subjects);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note: Note) => {
    if (note.id) {
      await notesService.incrementDownloads(note.id);
    }
    window.open(note.fileUrl, '_blank');
  };

  const currentSubjects = selectedLevel === "All" 
    ? availableSubjects
    : [...new Set(notesData.filter(n => n.level === selectedLevel).map(n => n.subject))].sort();

  const hasActiveFilters = selectedLevel !== "All" || selectedSubject !== "All" || 
    selectedYear !== "All" || searchQuery !== "";

  let filteredNotes = notesData.filter((note) => {
    const matchesLevel = selectedLevel === "All" || note.level === selectedLevel;
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
    const matchesYear = selectedYear === "All" || note.year === selectedYear;
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.year.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesSubject && matchesYear && matchesSearch;
  });

  if (!hasActiveFilters && filteredNotes.length > 12) {
    const diverseNotes: Note[] = [];
    const usedCombinations = new Set<string>();
    
    for (const note of filteredNotes) {
      const combo = `${note.subject}-${note.year}`;
      if (!usedCombinations.has(combo)) {
        diverseNotes.push(note);
        usedCombinations.add(combo);
        if (diverseNotes.length === 12) break;
      }
    }
    
    filteredNotes = diverseNotes.length === 12 ? diverseNotes : filteredNotes.slice(0, 12);
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
      </div>

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

      <Button 
        onClick={() => {
          setSelectedLevel("All");
          setSelectedSubject("All");
          setSelectedYear("All");
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/resource-hub-bg.svg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 py-12 px-6 md:px-8 lg:px-12 pt-28">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Study Notes
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Comprehensive notes to help you excel in your studies
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <Card className="p-6 sticky top-24 border-2 border-gray-900 shadow-lg bg-white">
                <FilterSidebar />
              </Card>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search by title, subject, or year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-6 text-base bg-white border-2 border-gray-900 focus:ring-2 focus:ring-blue-500"
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

              <div className="mb-6">
                <p className="text-gray-700 font-medium">
                  Showing <span className="text-gray-900 font-bold">{filteredNotes.length}</span> result{filteredNotes.length !== 1 ? 's' : ''}
                </p>
              </div>

              {loading && <LoadingSpinner />}
              {!loading && filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => (
                    <Card key={note.id} className="relative overflow-hidden border-2 border-gray-900 shadow-lg hover:shadow-xl transition-all group bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="relative z-10 p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2 line-clamp-2">
                            {note.title}
                          </h3>
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                          {note.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-2 py-0.5 text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {note.subject}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center">
                              <GraduationCap className="w-3.5 h-3.5 mr-1" />
                              <span className="font-medium">{note.level}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              <span className="font-medium">{note.year}</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 shadow-md text-sm"
                          onClick={() => handleDownload(note)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Notes
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : !loading ? (
                <Card className="p-12 text-center border-2 border-gray-900 bg-white">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notes Found</h3>
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

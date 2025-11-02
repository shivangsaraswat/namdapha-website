"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaBook, FaChartLine, FaFileAlt, FaLink, FaAddressBook, FaWhatsapp, FaChartBar, FaCalculator, FaGraduationCap, FaUsers, FaNewspaper, FaVideo, FaImage, FaMusic, FaCode, FaLaptop, FaFlask, FaMedal, FaTrophy, FaCertificate, FaClipboardList } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resourceService, ResourceCategory, Resource } from "@/lib/resourceService";

// Icon mapping
const iconMap: {[key: string]: React.ComponentType<{className?: string}>} = {
  'FaBook': FaBook,
  'FaChartLine': FaChartLine,
  'FaFileAlt': FaFileAlt,
  'FaLink': FaLink,
  'FaAddressBook': FaAddressBook,
  'FaWhatsapp': FaWhatsapp,
  'FaChartBar': FaChartBar,
  'FaCalculator': FaCalculator,
  'FaGraduationCap': FaGraduationCap,
  'FaUsers': FaUsers,
  'FaNewspaper': FaNewspaper,
  'FaVideo': FaVideo,
  'FaImage': FaImage,
  'FaMusic': FaMusic,
  'FaCode': FaCode,
  'FaLaptop': FaLaptop,
  'FaFlask': FaFlask,
  'FaMedal': FaMedal,
  'FaTrophy': FaTrophy,
  'FaCertificate': FaCertificate,
  'FaClipboardList': FaClipboardList
};

export default function ResourcesPage(){
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("Filter");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resourceCounts, setResourceCounts] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [handbookDialogOpen, setHandbookDialogOpen] = useState(false);
  const [gradedDocDialogOpen, setGradedDocDialogOpen] = useState(false);
  const [handbookResources, setHandbookResources] = useState<Resource[]>([]);
  const [gradedDocResources, setGradedDocResources] = useState<Resource[]>([]);
  const [emptyDialogOpen, setEmptyDialogOpen] = useState(false);
  const [emptyDialogCategory, setEmptyDialogCategory] = useState('');
  const [navigating, setNavigating] = useState(false);

  // Fetch categories and resource counts from Firebase
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [fetchedCategories, resources] = await Promise.all([
          resourceService.getActiveCategories(),
          resourceService.getPublishedResources()
        ]);
        
        if (!mounted) return;

        // Remove duplicates by ID
        const uniqueCategories = Array.from(
          new Map(fetchedCategories.map(cat => [cat.id, cat])).values()
        );
        
        setCategories(uniqueCategories);
        
        const counts: {[key: string]: number} = {};
        uniqueCategories.forEach(category => {
          counts[category.name] = resources.filter(r => r.category === category.name).length;
        });
        
        setResourceCounts(counts);
        
        // Filter resources for Student Handbook and Grading Document
        setHandbookResources(resources.filter(r => r.category === 'Student Handbook'));
        setGradedDocResources(resources.filter(r => r.category === 'Grading Document'));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setNavigating(true);
    
    if (categoryName === "Student Handbook") {
      setNavigating(false);
      if (handbookResources.length === 0) {
        setEmptyDialogCategory(categoryName);
        setEmptyDialogOpen(true);
        return;
      }
      setHandbookDialogOpen(true);
    } else if (categoryName === "Grading Document") {
      setNavigating(false);
      if (gradedDocResources.length === 0) {
        setEmptyDialogCategory(categoryName);
        setEmptyDialogOpen(true);
        return;
      }
      setGradedDocDialogOpen(true);
    } else if (categoryName === "Important Links") {
      router.push('/link-tree');
      return;
    } else if (categoryName === "Important Contacts") {
      router.push('/resources/important-contacts');
      return;
    } else if (categoryName === "PYQs") {
      router.push('/resources/pyqs');
      return;
    } else if (categoryName === "Verify Certificate") {
      router.push('/verify-certificate');
      return;
    } else if (categoryName === "Join WhatsApp Groups" || categoryName === "WhatsApp Groups") {
      router.push('/whatsapp');
      return;
    } else {
      setNavigating(false);
      setEmptyDialogCategory(categoryName);
      setEmptyDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="container relative mx-auto h-full max-w-[1200px]">
          <Image
            src="/bg.svg"
            alt="Background pattern left"
            width={358}
            height={1702}
            className="absolute -top-7 left-[-304px] opacity-10 lg:hidden"
            priority
          />
          <Image
            src="/bg.svg"
            alt="Background pattern right"
            width={358}
            height={1702}
            className="absolute bottom-0 right-[-320px] opacity-10 lg:hidden"
            priority
          />
          <Image
            src="/bg.svg"
            alt="Background pattern desktop"
            width={672}
            height={326}
            className="absolute right-0 top-0 opacity-10 hidden lg:block md:-right-8 md:-top-1.5 sm:top-2"
            priority
          />
        </div>
      </div>

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

        <div className="relative z-10 py-20 px-6 md:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Explore Resource Hub
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Access study materials, tools, and resources to support your academic journey
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Decorative Background Pattern */}
          <div className="absolute left-0 top-[120%] -translate-y-1/2 opacity-90 transform -translate-x-[330px] scale-105 pointer-events-none hidden lg:block">
            <Image
              src="/bg2.svg"
              alt="Pattern"
              width={358}
              height={1702}
              className="w-[358px] h-auto object-contain"
            />
          </div>
          <div className="absolute right-0 top-[135%] -translate-y-1/2 opacity-90 transform translate-x-[330px] scale-105 pointer-events-none hidden lg:block">
            <Image
              src="/bg2.svg"
              alt="Pattern"
              width={358}
              height={1702}
              className="w-[358px] h-auto object-contain transform scale-x-[-1]"
            />
          </div>
          
          {/* Search Bar and Filter Row */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex-1 lg:flex-initial lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-white backdrop-blur-sm border-2 border-black rounded-xl text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all"
                />
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px] px-5 py-3 bg-white backdrop-blur-sm border-2 border-black rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-black rounded-xl">
                  <SelectItem value="Filter">Filter</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resources Grid */}
          {(loading || navigating) && <LoadingSpinner />}
          {!loading && !navigating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {!loading && categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No resource categories available</p>
              </div>
            ) : !loading ? (
              categories.map((category) => {
                const IconComponent = iconMap[category.icon] || FaBook;
                return (
                  <div 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category.name)}
                    className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden border-2 border-black"
                  >
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="/councilbg.svg"
                          alt="Card background"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <IconComponent className={`w-7 h-7 ${category.iconColor}`} />
                        </div>

                        <h3 className="text-[20px] font-medium text-white leading-tight tracking-tight mb-3">
                          {category.name}
                        </h3>

                        <p className="text-white/90 text-[14px] leading-relaxed mb-3">
                          {category.description}
                        </p>

                        <div className="text-white/80 text-[12px] font-medium">
                          {resourceCounts[category.name] || 0} resources available
                        </div>
                      </div>
                  </div>
                );
              })
            ) : null}
          </div>
          )}

        </div>

        {/* Student Handbook Dialog */}
        {handbookDialogOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-white max-w-5xl w-full relative">
              <button onClick={() => setHandbookDialogOpen(false)} className="absolute top-4 right-4 bg-white/50 hover:bg-white/70 text-gray-900 rounded-lg px-4 py-2 text-xl transition-colors">
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" onClick={(e) => e.stopPropagation()}>
                {handbookResources.length > 0 ? (
                  handbookResources.map((resource) => (
                    <a 
                      key={resource.id} 
                      href={resource.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => resource.id && resourceService.incrementClicks(resource.id)}
                      className="relative rounded-xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group overflow-hidden border border-gray-400/30"
                    >
                      <div className="absolute inset-0 z-0">
                        <Image src="/councilbg.svg" alt="Card background" fill className="object-cover" />
                      </div>
                      <div className="absolute top-4 right-4 z-20 bg-white/90 rounded-lg p-2 shadow-md">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-6">
                          <FaBook className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-[24px] md:text-[28px] font-bold text-white mb-3">{resource.title}</h3>
                        <p className="text-white/90 text-[16px]">{resource.description}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-white text-lg">No handbooks available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Graded Document Dialog */}
        {/* Empty Category Dialog */}
        {emptyDialogOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-white max-w-md w-full relative">
              <button onClick={() => setEmptyDialogOpen(false)} className="absolute top-4 right-4 bg-white/50 hover:bg-white/70 text-gray-900 rounded-lg px-4 py-2 text-xl transition-colors">
                ×
              </button>
              <div className="text-center py-8">
                <h3 className="text-[24px] md:text-[28px] font-bold text-white mb-4">{emptyDialogCategory}</h3>
                <p className="text-white/90 text-[16px]">No resources available yet. Coming soon!</p>
              </div>
            </div>
          </div>
        )}

        {gradedDocDialogOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 md:p-10 border-2 border-white max-w-5xl w-full relative">
              <button onClick={() => setGradedDocDialogOpen(false)} className="absolute top-4 right-4 bg-white/50 hover:bg-white/70 text-gray-900 rounded-lg px-4 py-2 text-xl transition-colors">
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" onClick={(e) => e.stopPropagation()}>
                {gradedDocResources.length > 0 ? (
                  gradedDocResources.map((resource) => (
                    <a 
                      key={resource.id} 
                      href={resource.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => resource.id && resourceService.incrementClicks(resource.id)}
                      className="relative rounded-xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group overflow-hidden border border-gray-400/30"
                    >
                      <div className="absolute inset-0 z-0">
                        <Image src="/councilbg.svg" alt="Card background" fill className="object-cover" />
                      </div>
                      <div className="absolute top-4 right-4 z-20 bg-white/90 rounded-lg p-2 shadow-md">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-6">
                          <FaChartLine className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-[24px] md:text-[28px] font-bold text-white mb-3">{resource.title}</h3>
                        <p className="text-white/90 text-[16px]">{resource.description}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-white text-lg">No graded documents available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

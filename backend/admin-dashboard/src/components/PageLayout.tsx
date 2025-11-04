"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  activeItem: string;
  children: React.ReactNode;
  searchData?: Array<{ id: string; title: string; category?: string; type?: string }>;
  onSearchSelect?: (id: string) => void;
  isLoading?: boolean;
}

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', keywords: ['home', 'overview', 'stats'] },
  { name: 'Events', path: '/events', keywords: ['event', 'calendar', 'schedule'] },
  { name: 'Resource Hub', path: '/resource-hub', keywords: ['resources', 'documents', 'files'] },
  { name: 'Link Tree', path: '/link-tree', keywords: ['links', 'urls'] },
  { name: 'Council', path: '/council', keywords: ['members', 'team'] },
  { name: 'Teams', path: '/teams', keywords: ['groups', 'clubs'] },
  { name: 'Certificates', path: '/certificates', keywords: ['awards', 'achievements'] },
  { name: 'PYQs', path: '/resource-hub/pyqs', keywords: ['questions', 'papers', 'exams'] },
  { name: 'Important Contacts', path: '/resource-hub/important-contacts', keywords: ['contacts', 'directory'] },
];

export default function PageLayout({ title, subtitle, activeItem, children, searchData, onSearchSelect, isLoading = false }: PageLayoutProps) {
  const { isDarkMode, mounted } = useTheme();
  const { isCollapsed } = useSidebar();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredNavItems = navigationItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return query && (
      item.name.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.includes(query))
    );
  });

  const filteredSearchData = searchData?.filter(item => {
    const query = searchQuery.toLowerCase();
    return query && (
      item.title.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  }).slice(0, 7) || [];

  const hasResults = filteredNavItems.length > 0 || filteredSearchData.length > 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen font-sans ${
      isDarkMode ? 'bg-gray-800' : 'bg-[#F8F8F8]'
    }`}>
      <div className={`flex min-h-screen ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
        <Sidebar activeItem={activeItem} />

        <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-60'} p-6 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{title}</h1>
              {subtitle && (
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder={searchData ? "Search events..." : "Search pages..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className={`pl-10 w-full rounded-lg h-10 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-white border-gray-200'
                  }`}
                />
                {showSuggestions && hasResults && (
                  <div className={`absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-64 overflow-y-auto ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    {filteredSearchData.map((item) => (
                      <div
                        key={item.id}
                        className={`px-4 py-3 cursor-pointer ${
                          isDarkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'
                        }`}
                        onClick={() => {
                          onSearchSelect?.(item.id);
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="font-medium">{item.title}</div>
                        <div className={`text-xs mt-0.5 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {item.category} • {item.type}
                        </div>
                      </div>
                    ))}
                    {filteredNavItems.length > 0 && filteredSearchData.length > 0 && (
                      <div className={`border-t ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}></div>
                    )}
                    {filteredNavItems.map((item) => (
                      <div
                        key={item.path}
                        className={`px-4 py-3 cursor-pointer flex items-center gap-2 ${
                          isDarkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'
                        }`}
                        onClick={() => {
                          router.push(item.path);
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }}
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Separator Line */}
          <div className={`border-b mb-6 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}></div>

          {children}
        </div>
      </div>
      
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";

interface PageLayoutProps {
  title: string;
  activeItem: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, activeItem, children }: PageLayoutProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen font-sans ${
      isDarkMode ? 'bg-gray-800' : 'bg-[#F8F8F8]'
    }`}>
      <div className="flex">
        <Sidebar activeItem={activeItem} />

        <div className="flex-1 ml-60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{title}</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search anything..." 
                  className={`pl-10 w-80 rounded-lg h-10 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-white border-gray-200'
                  }`}
                />
              </div>
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 h-10">
                Create
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-orange-400 text-white text-xs">U</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Separator Line */}
          <div className={`border-b mb-6 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}></div>

          {children}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { FaUsers, FaFileAlt, FaBook, FaCalendar, FaLink, FaAward } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import AuthGuard from "@/components/AuthGuard";
import * as councilService from "@/lib/councilService";
import * as teamService from "@/lib/teamService";
import { resourceService } from "@/lib/resourceService";

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { isCollapsed } = useSidebar();
  const [stats, setStats] = useState({
    totalCouncil: 0,
    totalTeams: 0,
    totalResources: 0,
    publishedResources: 0,
    visibleCouncil: 0,
    visibleTeams: 0,
    totalPYQs: 0,
    totalEvents: 0,
  });
  const [recentResources, setRecentResources] = useState<Array<{title: string; category: string; status: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [council, teams, resources, pyqs, events] = await Promise.all([
          councilService.getCouncilMembers(),
          teamService.getTeamMembers(),
          resourceService.getAllResources(),
          import('@/lib/pyqService').then(m => m.pyqService.getAllPYQs()),
          import('@/lib/eventService').then(m => m.eventService.getAllEvents()),
        ]);

        setStats({
          totalCouncil: council.length,
          totalTeams: teams.length,
          totalResources: resources.length,
          publishedResources: resources.filter(r => r.status === 'published').length,
          visibleCouncil: council.filter(m => m.isVisible).length,
          visibleTeams: teams.filter(m => m.isVisible).length,
          totalPYQs: pyqs.length,
          totalEvents: events.length,
        });

        setRecentResources(resources.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthGuard requiredPermission="dashboard">
      <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-800' : 'bg-[#F8F8F8]'}`}>
        <div className="flex">
          <Sidebar activeItem="Dashboard" />

          <div className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-60'}`}>
            <div className="max-w-[1400px] mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome back! Here&apos;s what&apos;s happening with Namdapha House.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                      <FaUsers style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">
                      {stats.visibleCouncil} visible
                    </Badge>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalCouncil}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Council Members
                  </div>
                </CardContent>
              </Card>

              <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                      <FaUsers style={{ width: '20px', height: '20px', color: '#22C55E' }} />
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                      {stats.visibleTeams} visible
                    </Badge>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalTeams}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Team Members
                  </div>
                </CardContent>
              </Card>

              <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                      <FaFileAlt style={{ width: '20px', height: '20px', color: '#A855F7' }} />
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">
                      {stats.publishedResources} published
                    </Badge>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalResources}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Resources
                  </div>
                </CardContent>
              </Card>

              <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
                      <FaBook style={{ width: '20px', height: '20px', color: '#F97316' }} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalPYQs}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    PYQs Uploaded
                  </div>
                </CardContent>
              </Card>

              <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                      <FaCalendar style={{ width: '20px', height: '20px', color: '#14B8A6' }} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalEvents}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Events
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Recent Resources
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.location.href = '/resource-hub'}
                      className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                    >
                      View all <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : recentResources.length === 0 ? (
                      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No resources found
                      </div>
                    ) : (
                      recentResources.map((resource, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${
                          isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                        }`}>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaFileAlt className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {resource.title}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {resource.category}
                            </div>
                          </div>
                          <Badge className={`${
                            resource.status === 'published' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          }`}>
                            {resource.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "Manage Events", icon: FaCalendar, link: "/events", color: "from-pink-500 to-rose-500" },
                      { title: "Resource Hub", icon: FaFileAlt, link: "/resource-hub", color: "from-indigo-500 to-purple-500" },
                      { title: "Certificates", icon: FaAward, link: "/certificates", color: "from-yellow-500 to-orange-500" },
                      { title: "Link Tree", icon: FaLink, link: "/link-tree", color: "from-teal-500 to-cyan-500" },
                      { title: "Council", icon: FaUsers, link: "/council", color: "from-blue-500 to-indigo-500" },
                      { title: "Teams", icon: FaUsers, link: "/teams", color: "from-green-500 to-emerald-500" },
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={() => window.location.href = action.link}
                        className={`w-full p-4 rounded-xl transition-all hover:scale-105 flex items-center gap-3 ${
                          isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {action.title}
                        </span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

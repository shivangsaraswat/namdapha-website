"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FaUsers, 
  FaFileAlt, 
  FaBook, 
  FaCalendar, 
  FaBell, 
  FaArrowUp, 
  FaArrowDown,
  FaEye
} from "react-icons/fa";
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  FileText, 
  Bell,
  ChevronRight,
  Activity
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import AuthGuard from "@/components/AuthGuard";
import * as councilService from "@/lib/councilService";
import * as teamService from "@/lib/teamService";
import { resourceService } from "@/lib/resourceService";
import { notificationService } from "@/lib/notificationService";

interface Event {
  id?: string;
  title: string;
  date: string;
  status: string;
  registrations?: number;
}

interface Activity {
  id?: string;
  name: string;
  description: string;
  logo: string;
  poster: string;
  category: string;
  registrationLink?: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ResourceStats {
  category: string;
  count: number;
  trend: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { isCollapsed } = useSidebar();
  const [stats, setStats] = useState({
    totalCouncil: 0,
    totalTeams: 0,
    totalResources: 0,
    totalPYQs: 0,
    totalEvents: 0,
    activeNotifications: 0,
    totalActivities: 0,
    visibleActivities: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [resourceStats, setResourceStats] = useState<ResourceStats[]>([]);
  const [monthlyData, setMonthlyData] = useState<{month: string, events: number, resources: number}[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [
        council, 
        teams, 
        resources, 
        pyqs, 
        events, 
        notifications,
        activities,
        notes,
        books
      ] = await Promise.all([
        councilService.getCouncilMembers(),
        teamService.getTeamMembers(),
        resourceService.getAllResources(),
        import('@/lib/pyqService').then(m => m.pyqService.getAllPYQs()),
        import('@/lib/eventService').then(m => m.eventService.getAllEvents()),
        notificationService.getAllNotifications(),
        import('@/lib/activitiesService').then(m => m.activitiesService.getAllActivities()).catch(() => []),
        import('@/lib/notesService').then(m => m.notesService.getAllNotes()).catch(() => []),
        import('@/lib/bookService').then(m => m.bookService.getAllBooks()).catch(() => []),
      ]);

      // Process upcoming events
      const now = new Date();
      const upcoming = events
        .filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
      setUpcomingEvents(upcoming);

      // Process recent activities
      const recent = activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);
      setRecentActivities(recent);

      // Process active notifications
      const active = notifications.filter(n => n.isActive && (!n.expiresAt || new Date(n.expiresAt) > now));
      setActiveNotifications(active);

      // Process resource statistics
      const resourceCategories = [
        { category: 'Notes', count: notes.length, trend: 5 },
        { category: 'Books', count: books.length, trend: 2 },
        { category: 'PYQs', count: pyqs.length, trend: 8 },
        { category: 'Videos', count: resources.filter(r => r.category === 'Video Lectures').length, trend: 3 },
      ];
      setResourceStats(resourceCategories);

      // Generate monthly data for charts
      const monthlyStats = generateMonthlyData(events, [...resources, ...notes, ...books]);
      setMonthlyData(monthlyStats);

      setStats({
        totalCouncil: council.length,
        totalTeams: teams.length,
        totalResources: resources.length + notes.length + books.length,
        totalPYQs: pyqs.length,
        totalEvents: events.length,
        activeNotifications: active.length,
        totalActivities: activities.length,
        visibleActivities: activities.filter(a => a.isVisible).length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const generateMonthlyData = (events: {date?: string; createdAt?: Date}[], resources: {createdAt?: Date}[]): {month: string, events: number, resources: number}[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthEvents = events.filter(e => {
        const eventDate = e.date ? new Date(e.date) : (e.createdAt ? new Date(e.createdAt) : new Date());
        return eventDate.getMonth() === index;
      }).length;
      
      const monthResources = resources.filter(r => {
        if (!r.createdAt) return false;
        const resourceDate = new Date(r.createdAt);
        return resourceDate.getMonth() === index;
      }).length;

      return {
        month,
        events: monthEvents,
        resources: monthResources
      };
    });
  };

  const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }: {
    title: string;
    value: number;
    icon: React.ComponentType<{className?: string; style?: React.CSSProperties}>;
    trend?: number;
    color: string;
    subtitle?: string;
  }) => (
    <Card className={`rounded-lg sm:rounded-xl shadow-sm border-0 hover:shadow-md transition-all duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
      <CardContent className="p-2 sm:p-3 lg:p-4">
        <div className="flex items-center justify-between mb-1 sm:mb-2 lg:mb-3">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
            <Icon style={{ width: '12px', height: '12px', color }} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </div>
          {trend && (
            <div className={`flex items-center gap-0.5 sm:gap-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <FaArrowUp className="w-2 h-2 sm:w-3 sm:h-3" /> : <FaArrowDown className="w-2 h-2 sm:w-3 sm:h-3" />}
              <span className="hidden sm:inline">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
        <div className={`text-xs font-medium leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="hidden sm:inline">{title}</span>
          <span className="sm:hidden">{title.split(' ')[0]}</span>
        </div>
        {subtitle && (
          <div className={`text-xs mt-0.5 sm:mt-1 hidden lg:block ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const MiniChart = ({ data }: { data: {month: string, events: number, resources: number}[] }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.events, d.resources)));
    
    return (
      <div className="flex items-end gap-1 h-16">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex flex-col gap-0.5 w-full">
              <div 
                className="bg-blue-500 rounded-sm"
                style={{ height: `${(item.events / maxValue) * 40}px`, minHeight: '2px' }}
              />
              <div 
                className="bg-purple-500 rounded-sm"
                style={{ height: `${(item.resources / maxValue) * 40}px`, minHeight: '2px' }}
              />
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.month}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <AuthGuard requiredPermission="dashboard">
        <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-800' : 'bg-[#F8F8F8]'}`}>
          <div className="flex">
            <Sidebar activeItem="Dashboard" />
            <div className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-60'}`}>
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredPermission="dashboard">
      <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-800' : 'bg-[#F8F8F8]'}`}>
        <div className="flex">
          <Sidebar activeItem="Dashboard" />

          <div className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-60'}`}>
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="mb-6 lg:mb-8">
                <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dashboard
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back! Here&apos;s what&apos;s happening with Namdapha House.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-6 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 mb-6 lg:mb-8">
                <StatCard
                  title="Council Members"
                  value={stats.totalCouncil}
                  icon={FaUsers}
                  color="#3B82F6"
                  trend={2}
                />
                <StatCard
                  title="Team Members"
                  value={stats.totalTeams}
                  icon={FaUsers}
                  color="#22C55E"
                  trend={5}
                />
                <StatCard
                  title="Total Resources"
                  value={stats.totalResources}
                  icon={FaFileAlt}
                  color="#A855F7"
                  trend={12}
                />
                <StatCard
                  title="PYQs Available"
                  value={stats.totalPYQs}
                  icon={FaBook}
                  color="#F97316"
                  trend={8}
                />
                <StatCard
                  title="Total Events"
                  value={stats.totalEvents}
                  icon={FaCalendar}
                  color="#14B8A6"
                  trend={-3}
                />
                <StatCard
                  title="Active Notifications"
                  value={stats.activeNotifications}
                  icon={FaBell}
                  color="#EF4444"
                  subtitle={`${stats.totalActivities} activities`}
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                
                {/* Left Column - Large Widgets */}
                <div className="lg:col-span-8 space-y-4 lg:space-y-6">
                  
                  {/* Activity Overview Chart */}
                  <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Activity Overview
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Events</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Resources</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MiniChart data={monthlyData} />
                    </CardContent>
                  </Card>

                  {/* Resource Statistics */}
                  <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <CardHeader className="pb-4">
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Resource Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {resourceStats.map((stat, index) => (
                          <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {stat.category}
                              </span>
                              <div className={`flex items-center gap-1 text-xs ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stat.trend}
                              </div>
                            </div>
                            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {stat.count}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(stat.count / Math.max(...resourceStats.map(s => s.count))) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Recent Activities
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = '/activities'}
                        className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                      >
                        View all <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {recentActivities.length === 0 ? (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No recent activities found</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className={`flex items-center gap-4 p-3 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Activity className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {activity.name}
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {activity.category} • {new Date(activity.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Badge variant={activity.isVisible ? 'default' : 'secondary'}>
                                {activity.isVisible ? 'Visible' : 'Hidden'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Sidebar Widgets */}
                <div className="lg:col-span-4 space-y-4 lg:space-y-6">
                  
                  {/* Upcoming Events */}
                  <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Upcoming Events
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = '/events'}
                        className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {upcomingEvents.length === 0 ? (
                        <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No upcoming events</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {upcomingEvents.map((event, index) => (
                            <div key={index} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'}`}>
                              <div className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {event.title}
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Clock className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <Badge className="mt-2" variant={event.status === 'published' ? 'default' : 'secondary'}>
                                {event.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Active Notifications */}
                  <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Live Notifications
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = '/notifications'}
                        className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {activeNotifications.length === 0 ? (
                        <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No active notifications</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {activeNotifications.slice(0, 3).map((notification, index) => (
                            <div key={index} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'}`}>
                              <div className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notification.title}
                              </div>
                              <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {notification.message.substring(0, 60)}...
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge variant={notification.type === 'warning' ? 'destructive' : 'default'}>
                                  {notification.type}
                                </Badge>
                                <div className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <FaEye className="w-3 h-3" />
                                  Active
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <CardHeader>
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {([
                        { title: "Create Event", icon: Calendar, link: "/events", color: "from-pink-500 to-rose-500" },
                        { title: "Add Resource", icon: FileText, link: "/resource-hub", color: "from-indigo-500 to-purple-500" },
                        { title: "Send Notification", icon: Bell, link: "/notifications", color: "from-yellow-500 to-orange-500" },
                        { title: "Manage Teams", icon: Users, link: "/teams", color: "from-green-500 to-emerald-500" },
                      ] as const).map((action, index) => (
                        <button
                          key={index}
                          onClick={() => window.location.href = action.link}
                          className={`w-full p-3 rounded-xl transition-all hover:scale-105 flex items-center gap-3 ${
                            isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}>
                            <action.icon className="w-4 h-4 text-white" />
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
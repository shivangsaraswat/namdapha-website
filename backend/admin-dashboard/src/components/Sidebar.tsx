"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Grid3X3, Calendar, BookOpen, Link2, Shield, Users2, Award, FileText, Moon, Sun, LogOut, Settings, User, Power, Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { signOut } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem = "Dashboard" }: SidebarProps) {
  const { isDarkMode, toggleDarkMode, mounted } = useTheme();
  const { user, hasPermission, isLoading } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isPending, startTransition] = useTransition();
  const [showPopup, setShowPopup] = useState(false);
  const [imageError, setImageError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const allMenuItems = [
    { name: "Dashboard", icon: Grid3X3, href: "/dashboard", permission: "dashboard" },
    { name: "Events", icon: Calendar, href: "/events", permission: "events" },
    { name: "Activities", icon: Sparkles, href: "/activities", permission: "activities" },
    { name: "Resource Hub", icon: BookOpen, href: "/resource-hub", permission: "resource-hub" },
    { name: "Link Tree", icon: Link2, href: "/link-tree", permission: "link-tree" },
    { name: "Council", icon: Shield, href: "/council", permission: "council" },
    { name: "Teams", icon: Users2, href: "/teams", permission: "teams" },
    { name: "Certificates", icon: Award, href: "/certificates", permission: "certificates" },
    { name: "Forms", icon: FileText, href: "/forms", permission: "forms" },
  ];

  const superAdminItems = [
    { name: "Maintenance", icon: Power, href: "/admin/maintenance", permission: "*" },
  ];

  const menuItems = isLoading ? allMenuItems : allMenuItems.filter(item => hasPermission(item.permission));
  const adminItems = user?.role === 'super-admin' ? superAdminItems : [];

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: "/auth/signin",
      redirect: true 
    });
  };

  if (!mounted || isLoading) {
    return (
      <div className="w-60 h-screen fixed left-0 top-0 p-6 flex flex-col bg-white">
        <div className="flex items-center gap-2 mb-6 flex-shrink-0">
          <Image
            src="/namd-new-logo.png"
            alt="Namdapha Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden pr-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === activeItem;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive ? "text-gray-700" : "text-gray-500"
                }`} />
                <span className={`text-sm font-medium ${
                  isActive ? "text-gray-900" : "text-gray-700"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === activeItem;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive ? "text-gray-700" : "text-gray-500"
                }`} />
                <span className={`text-sm font-medium ${
                  isActive ? "text-gray-900" : "text-gray-700"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile Section */}
        <div className="border-t pt-3 mt-3 flex-shrink-0 relative" ref={popupRef}>
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              {user?.image && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt="User Avatar"
                  className="rounded-full w-8 h-8 object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-200">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace('-', ' ')}
              </p>
            </div>
          </button>
          
          {showPopup && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {user?.role === 'super-admin' && (
                <Link
                  href="/admin/users"
                  onClick={() => setShowPopup(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">User Management</span>
                </Link>
              )}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-gray-500" /> : <Moon className="w-4 h-4 text-gray-500" />}
                <span className="text-sm font-medium text-gray-700">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-600">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-60'} h-screen fixed left-0 top-0 ${isCollapsed ? 'p-3' : 'p-6'} flex flex-col transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        {!isCollapsed && (
          <Image
            src="/namd-new-logo.png"
            alt="Namdapha Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className={`space-y-1 flex-1 overflow-y-auto overflow-x-hidden pr-2 min-h-0 ${
        isDarkMode 
          ? 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600' 
          : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400'
      }`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === activeItem;
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              title={isCollapsed ? item.name : ''}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg cursor-pointer transition-colors text-left ${
                isActive 
                  ? isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${
                isActive 
                  ? isDarkMode ? "text-gray-300" : "text-gray-700"
                  : isDarkMode ? "text-gray-400" : "text-gray-500"
              }`} />
              {!isCollapsed && <span className={`text-sm font-medium ${
                isActive 
                  ? isDarkMode ? "text-white" : "text-gray-900"
                  : isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                {item.name}
              </span>}
            </button>
          );
        })}
        {adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === activeItem;
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              title={isCollapsed ? item.name : ''}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg cursor-pointer transition-colors text-left ${
                isActive 
                  ? isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${
                isActive 
                  ? isDarkMode ? "text-gray-300" : "text-gray-700"
                  : isDarkMode ? "text-gray-400" : "text-gray-500"
              }`} />
              {!isCollapsed && <span className={`text-sm font-medium ${
                isActive 
                  ? isDarkMode ? "text-white" : "text-gray-900"
                  : isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                {item.name}
              </span>}
            </button>
          );
        })}
      </nav>
      {isPending && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999 }}>
          <LoadingSpinner />
        </div>
      )}
      
      {/* User Profile Section */}
      <div className={`border-t pt-3 mt-3 flex-shrink-0 relative ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`} ref={popupRef}>
        <button
          onClick={() => setShowPopup(!showPopup)}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
          }`}
        >
          <div className="relative w-8 h-8 flex-shrink-0">
            {user?.image && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="User Avatar"
                className="rounded-full w-8 h-8 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className={`text-sm font-medium truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.name || 'Loading...'}
              </p>
              <p className={`text-xs capitalize ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {user?.role?.replace('-', ' ') || 'User'}
              </p>
            </div>
          )}
        </button>
        
        {showPopup && (
          <div className={`absolute bottom-full left-0 mb-2 w-full rounded-lg shadow-lg border py-2 z-50 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {user?.role === 'super-admin' && (
              <Link
                href="/admin/users"
                onClick={() => setShowPopup(false)}
                className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <Settings className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>User Management</span>
              </Link>
            )}
            <button
              onClick={() => { toggleDarkMode(); setShowPopup(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-left ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-gray-400" /> : <Moon className="w-4 h-4 text-gray-500" />}
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-left ${
                isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
              }`}
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Grid3X3, Calendar, BookOpen, Link2, Shield, Users2, Award, FileText, Moon, Sun, LogOut, Settings, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "next-auth/react";

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem = "Dashboard" }: SidebarProps) {
  const { isDarkMode, toggleDarkMode, mounted } = useTheme();
  const { user, hasPermission, isLoading } = useAuth();

  const allMenuItems = [
    { name: "Dashboard", icon: Grid3X3, href: "/dashboard", permission: "dashboard" },
    { name: "Events", icon: Calendar, href: "/events", permission: "events" },
    { name: "Resource Hub", icon: BookOpen, href: "/resource-hub", permission: "resource-hub" },
    { name: "Link Tree", icon: Link2, href: "/link-tree", permission: "link-tree" },
    { name: "Council", icon: Shield, href: "/council", permission: "council" },
    { name: "Teams", icon: Users2, href: "/teams", permission: "teams" },
    { name: "Certificates", icon: Award, href: "/certificates", permission: "certificates" },
    { name: "Forms", icon: FileText, href: "/forms", permission: "forms" },
  ];

  const menuItems = isLoading ? allMenuItems : allMenuItems.filter(item => hasPermission(item.permission));

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: "/auth/signin",
      redirect: true 
    });
  };

  if (!mounted || isLoading) {
    return (
      <div className="w-60 h-screen fixed left-0 top-0 p-6 flex flex-col bg-white">
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/namd-new-logo.png"
            alt="Namdapha Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <nav className="space-y-1 flex-1">
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
        </nav>
        
        {/* User Profile Section */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="User Avatar"
                className="rounded-full w-8 h-8 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 ${user?.image ? 'hidden' : ''}`}>
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace('-', ' ')}
              </p>
            </div>
          </div>
          
          {user?.role === 'super-admin' && (
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                User Management
              </span>
            </Link>
          )}
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-60 min-h-screen fixed left-0 top-0 p-6 flex flex-col ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex items-center gap-2 mb-8">
        <Image
          src="/namd-new-logo.png"
          alt="Namdapha Logo"
          width={64}
          height={64}
          className="rounded-full"
        />
      </div>
      
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === activeItem;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                isActive 
                  ? isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${
                isActive 
                  ? isDarkMode ? "text-gray-300" : "text-gray-700"
                  : isDarkMode ? "text-gray-400" : "text-gray-500"
              }`} />
              <span className={`text-sm font-medium ${
                isActive 
                  ? isDarkMode ? "text-white" : "text-gray-900"
                  : isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile Section */}
      <div className={`border-t pt-3 space-y-1 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3 px-3 py-2">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt="User Avatar"
              className="rounded-full w-8 h-8 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          } ${user?.image ? 'hidden' : ''}`}>
            <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
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
        </div>
        
        {user?.role === 'super-admin' && (
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
          >
            <Settings className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              User Management
            </span>
          </Link>
        )}
        
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
            isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
          }`}
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-600">
            Sign Out
          </span>
        </button>
      </div>
      
      <div className="flex justify-center pt-2">
        <button 
          onClick={toggleDarkMode}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 flex items-center justify-center ${
            isDarkMode ? 'translate-x-6' : 'translate-x-0'
          }`}>
            {isDarkMode ? (
              <Moon className="w-3 h-3 text-gray-600" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-500" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
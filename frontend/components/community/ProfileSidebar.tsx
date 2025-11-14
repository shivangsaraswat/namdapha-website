"use client";

import { useState } from 'react';
import Image from 'next/image';
import { CommunityUser } from '@/lib/communityService';
import { Users, Bookmark, Calendar, Copy } from 'lucide-react';

interface ProfileSidebarProps {
  user: CommunityUser | null;
  onEditProfile?: () => void;
}

export default function ProfileSidebar({ user, onEditProfile }: ProfileSidebarProps) {
  if (!user) {
    return (
      <div className="sticky top-[88px] space-y-2">
        <div className="bg-white rounded-lg border border-[#d4d4d4] overflow-hidden">
          <div className="h-[54px] bg-gradient-to-r from-[#2d5e7e] to-[#3a7391]"></div>
          <div className="px-3 pb-4">
            <div className="flex justify-center -mt-9 mb-3">
              <div className="w-[72px] h-[72px] rounded-full bg-gray-300 border-2 border-white"></div>
            </div>
            <div className="text-center">
              <p className="text-sm text-[#00000099] mb-4">Sign in to see your profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[88px] space-y-2">
      {/* Main Profile Card */}
      <div className="bg-white rounded-lg border border-[#d4d4d4] overflow-hidden shadow-sm">
        {/* Cover Image */}
        <div className="h-[54px] relative bg-gradient-to-r from-[#2d5e7e] to-[#3a7391]">
          {user.coverImage && (
            <Image src={user.coverImage} alt="Cover" fill className="object-cover" />
          )}
        </div>
        
        {/* Profile Content */}
        <div className="relative">
          {/* Profile Image - Overlapping cover */}
          <div className="flex justify-center -mt-9 mb-2">
            <div className="relative group cursor-pointer" onClick={onEditProfile}>
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user.name} 
                  width={72} 
                  height={72} 
                  className="rounded-full border-2 border-white object-cover hover:brightness-95 transition-all"
                />
              ) : (
                <div className="w-[72px] h-[72px] rounded-full bg-[#6b7280] flex items-center justify-center border-2 border-white hover:brightness-95 transition-all">
                  <span className="text-white font-semibold text-2xl">
                    {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="px-3 pb-3">
            {/* Copy URL */}
            <div className="flex justify-end mb-2">
              <button className="text-xs text-[#0000009a] hover:text-[#0a66c2] font-semibold flex items-center gap-1 transition-colors">
                <span>Copy URL</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center mb-3">
              <h3 className="text-base font-semibold text-[#000000e6] hover:underline cursor-pointer leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-[#0000009a] mt-1 leading-[1.4]">
                {user.headline || 'UI & UX Designer · United States'}
              </p>
              {user.location && (
                <p className="text-xs text-[#0000009a] mt-1">{user.location}</p>
              )}
              {user.website && (
                <p className="text-xs text-[#0000009a] mt-2 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                  <span>Figma</span>
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#00000024] my-3"></div>

            {/* Stats */}
            <div className="space-y-0 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-[#0000009a] hover:bg-[#0000000a] -mx-3 px-3 py-1.5 cursor-pointer transition-colors">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="1.5" />
                </svg>
                <span>Last 30d</span>
              </div>
              <div className="flex items-center justify-between hover:bg-[#0000000a] -mx-3 px-3 py-1.5 cursor-pointer transition-colors">
                <span className="text-xs text-[#0000009a]">Profile views</span>
                <span className="text-xs font-semibold text-[#0a66c2]">
                  {user.stats?.profileViews || 122}
                </span>
              </div>
              <div className="flex items-center justify-between hover:bg-[#0000000a] -mx-3 px-3 py-1.5 cursor-pointer transition-colors">
                <span className="text-xs text-[#0000009a]">Post impressions</span>
                <span className="text-xs font-semibold text-[#0a66c2]">
                  {user.stats?.postImpressions?.toLocaleString() || '17,826'}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#00000024] my-3"></div>

            {/* Premium CTA */}
            <div className="text-xs leading-[1.4]">
              <p className="text-[#0000009a] mb-2">
                Access exclusive tools & insights
              </p>
              <button className="flex items-center gap-2 text-[#000000e6] font-semibold hover:bg-[#0000000a] -mx-3 px-3 py-1 rounded transition-colors">
                <div className="w-4 h-4 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-sm flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white font-bold" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="4" width="12" height="8" rx="1" />
                  </svg>
                </div>
                <span>Try Premium for FREE</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#00000024] my-3"></div>

            {/* My Items */}
            <button className="flex items-center gap-2.5 text-xs text-[#0000009a] hover:bg-[#0000000a] hover:text-[#000000e6] font-semibold -mx-3 px-3 py-1.5 rounded transition-colors w-full">
              <Bookmark className="w-4 h-4" />
              <span>My items</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Links Card */}
      <div className="bg-white rounded-lg border border-[#d4d4d4] overflow-hidden shadow-sm">
        <button className="w-full px-3 py-3 text-left hover:bg-[#0000000a] transition-colors flex items-center gap-2.5 text-xs text-[#0000009a] font-semibold">
          <Users className="w-4 h-4" />
          <span>My Network</span>
        </button>
        <div className="border-t border-[#00000024]"></div>
        <button className="w-full px-3 py-3 text-left hover:bg-[#0000000a] transition-colors flex items-center gap-2.5 text-xs text-[#0000009a] font-semibold">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v1h8V5H4zm0 3v1h8V8H4z" />
          </svg>
          <span>Groups</span>
        </button>
        <div className="border-t border-[#00000024]"></div>
        <button className="w-full px-3 py-3 text-left hover:bg-[#0000000a] transition-colors flex items-center gap-2.5 text-xs text-[#0000009a] font-semibold">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 1v1h8V4H4zm0 3v1h8V7H4zm0 3v1h5v-1H4z" />
          </svg>
          <span>Newsletters</span>
        </button>
        <div className="border-t border-[#00000024]"></div>
        <button className="w-full px-3 py-3 text-left hover:bg-[#0000000a] transition-colors flex items-center gap-2.5 text-xs text-[#0000009a] font-semibold">
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </button>
        <div className="border-t border-[#00000024]"></div>
        <button className="w-full px-3 py-3 text-left hover:bg-[#0000000a] transition-colors flex items-center gap-2.5 text-xs text-[#0000009a] font-semibold">
          <Calendar className="w-4 h-4" />
          <span>Events</span>
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-3 py-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#0000009a] leading-tight">
          <a href="#" className="hover:text-[#0a66c2] hover:underline">About</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">Accessibility</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">Help Center</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">Privacy & Terms</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">Ad Choices</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">Advertising</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">Business Services</a>
          <a href="#" className="hover:text-[#0a66c2] hover:underline">LinkedIn App</a>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px]">
          <svg className="w-4 h-4 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
          </svg>
          <span className="text-[#0000009a]">LinkedIn Corporation</span>
          <span className="text-[#0000009a]">© 2025</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CommunityUser } from '@/lib/communityService';
import { Users, Bookmark, Calendar, Copy, Bell } from 'lucide-react';

interface ProfileSidebarProps {
  user: CommunityUser | null;
  onEditProfile?: () => void;
}

export default function ProfileSidebar({ user, onEditProfile }: ProfileSidebarProps) {
  if (!user) {
    return (
      <div className="sticky top-[88px] space-y-4">
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-sm">
          <div className="h-16 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"></div>
          <div className="px-4 pb-4">
            <div className="flex items-start gap-3 -mt-8">
              <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white shadow-md flex-shrink-0"></div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-[#666] mb-4">Sign in to see your profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Single Profile Card */}
      <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
        {/* Cover Image */}
        <div className="h-16 relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
          {user.coverImage && (
            <Image src={user.coverImage} alt="Cover" fill className="object-cover" />
          )}
        </div>
        
        {/* Profile Content */}
        <div className="relative px-3 pb-2">
          {/* Profile Image & Copy URL - Same line */}
          <div className="flex items-start justify-between -mt-8 mb-1">
            <Link href="/community/profile" className="relative group cursor-pointer flex-shrink-0">
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user.name} 
                  width={72} 
                  height={72} 
                  className="rounded-full border-2 border-white object-cover hover:brightness-95 transition-all w-[72px] h-[72px]"
                />
              ) : (
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center border-2 border-white hover:brightness-95 transition-all">
                  <span className="text-white font-semibold text-xl">
                    {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </Link>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/community/in/${user.profileSlug}`;
                navigator.clipboard.writeText(url);
              }}
              className="text-[11px] text-[#00000099] hover:text-[#0a66c2] font-medium flex items-center gap-1 transition-colors mt-10"
            >
              <span>Copy URL</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-2">
            <Link href="/community/profile" className="text-base font-semibold text-[#000000e6] hover:underline cursor-pointer leading-tight block">
              {user.name}
            </Link>
            {user.headline && (
              <p className="text-xs text-[#00000099] mt-0.5 leading-[1.33]">
                {user.headline}
              </p>
            )}
            {user.website && (
              <p className="text-xs text-[#00000099] mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="8" r="2" />
                </svg>
                <span>Figma</span>
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#e0e0e0] my-2"></div>

          {/* Stats */}
          <div className="space-y-0 mb-2">
            <div className="flex items-center justify-between hover:bg-[#0000000a] -mx-3 px-3 py-1 cursor-pointer transition-colors">
              <span className="text-xs text-[#00000099]">Profile views</span>
              <span className="text-sm font-semibold text-[#0a66c2]">
                {Math.max(0, user.stats?.profileViews || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between hover:bg-[#0000000a] -mx-3 px-3 py-1 cursor-pointer transition-colors">
              <span className="text-xs text-[#00000099]">Post impressions</span>
              <span className="text-sm font-semibold text-[#0a66c2]">
                {Math.max(0, user.stats?.postImpressions || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e0e0e0] my-2"></div>

          {/* My Network */}
          <Link href="/community/mynetwork" className="w-full text-left hover:bg-[#0000000a] -mx-3 px-3 py-2 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#666666]" />
              <span className="text-xs text-[#000000e6] font-semibold">My Network</span>
            </div>
          </Link>

          {/* Groups */}
          <button className="w-full text-left hover:bg-[#0000000a] -mx-3 px-3 py-2 transition-colors flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#666666]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v1h8V5H4zm0 3v1h8V8H4z" />
            </svg>
            <span className="text-xs text-[#000000e6] font-semibold">Groups</span>
          </button>

          {/* Newsletters */}
          <button className="w-full text-left hover:bg-[#0000000a] -mx-3 px-3 py-2 transition-colors flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#666666]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 1v1h8V4H4zm0 3v1h8V7H4zm0 3v1h5v-1H4z" />
            </svg>
            <span className="text-xs text-[#000000e6] font-semibold">Newsletters</span>
          </button>

          {/* Saved */}
          <button className="w-full text-left hover:bg-[#0000000a] -mx-3 px-3 py-2 transition-colors flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-[#666666]" />
            <span className="text-xs text-[#000000e6] font-semibold">Saved</span>
          </button>

          {/* Events */}
          <button className="w-full text-left hover:bg-[#0000000a] -mx-3 px-3 py-2 transition-colors flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#666666]" />
            <span className="text-xs text-[#000000e6] font-semibold">Events</span>
          </button>

          {/* Divider */}
          <div className="border-t border-[#e0e0e0] my-2"></div>

          {/* Premium CTA */}
          <button className="w-full text-left hover:bg-[#0000000a] -mx-3 px-3 py-2 transition-colors flex items-center gap-2.5">
            <div className="w-4 h-4 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-sm flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-white font-bold" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="4" width="12" height="8" rx="1" />
              </svg>
            </div>
            <span className="text-xs text-[#000000e6] font-semibold">Try Premium for FREE</span>
          </button>
        </div>
      </div>
    </div>
  );
}

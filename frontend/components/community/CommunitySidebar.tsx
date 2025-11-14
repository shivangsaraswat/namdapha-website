"use client";

import Image from 'next/image';
import { CommunityUser } from '@/lib/communityService';
import { Users, TrendingUp, Calendar } from 'lucide-react';

interface CommunitySidebarProps {
  user: CommunityUser | null;
}

export default function CommunitySidebar({ user }: CommunitySidebarProps) {
  return (
    <div className="sticky top-20 space-y-4">
      {user && (
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
          <div className="flex flex-col items-center text-center">
            {user.profileImage ? (
              <Image src={user.profileImage} alt={user.username} width={64} height={64} className="rounded-full mb-3" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#4F46E5] flex items-center justify-center mb-3">
                <span className="text-white font-bold text-xl">{user.username[0].toUpperCase()}</span>
              </div>
            )}
            <h3 className="text-sm font-semibold text-[#121317]">{user.name}</h3>
            <p className="text-xs text-[#6B7280]">@{user.username}</p>
            
            <div className="grid grid-cols-3 gap-3 mt-4 w-full">
              <div className="text-center">
                <p className="font-semibold text-base text-[#121317]">{user.stats.posts}</p>
                <p className="text-[10px] text-[#6B7280]">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-base text-[#121317]">{user.stats.followers}</p>
                <p className="text-[10px] text-[#6B7280]">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-base text-[#121317]">{user.stats.following}</p>
                <p className="text-[10px] text-[#6B7280]">Following</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 space-y-3">
        <h3 className="text-sm font-semibold text-[#121317] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Active Members
            </span>
            <span className="text-sm font-medium text-[#121317]">1,234</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Posts Today
            </span>
            <span className="text-sm font-medium text-[#121317]">42</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import Image from 'next/image';
import { UserPlus } from 'lucide-react';

interface RecommendedUser {
  id: string;
  name: string;
  username: string;
  image?: string;
  role: string;
  mutualConnections: number;
}

export default function RecommendationsSidebar() {
  const [activeTab, setActiveTab] = useState<'network' | 'jobs' | 'groups'>('network');

  const recommendedUsers: RecommendedUser[] = [
    { id: '1', name: 'Jerome Bell', username: 'jbell', role: 'Interaction Designer', mutualConnections: 12 },
    { id: '2', name: 'Cody Fisher', username: 'cfisher', role: 'Interaction Designer', mutualConnections: 12 },
    { id: '3', name: 'Cameron Williamson', username: 'cwill', role: 'Interaction Designer', mutualConnections: 12 },
  ];

  const nyuUsers: RecommendedUser[] = [
    { id: '4', name: 'Theresa Webb', username: 'twebb', role: 'Interaction Designer', mutualConnections: 12 },
    { id: '5', name: 'Jacob Jones', username: 'jjones', role: 'Interaction Designer', mutualConnections: 8 },
    { id: '6', name: 'Floyd Miles', username: 'fmiles', role: 'Interaction Designer', mutualConnections: 12 },
  ];

  const companies = [
    { name: 'Adobe Illustrator', category: 'Graphic Design', followers: '242 connections follow this page' },
    { name: 'Figma', category: 'Design Services', followers: '112 connections follow this page' },
    { name: 'Webflow', category: 'Software Development', followers: '20 connections follow this page' },
  ];

  return (
    <div className="sticky top-[88px] space-y-2">
      {/* Recommendations Card */}
      <div className="bg-white rounded-lg border border-[#d4d4d4] overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-[#00000024]">
          <button
            onClick={() => setActiveTab('network')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'network'
                ? 'text-[#01754f]'
                : 'text-[#0000009a] hover:text-[#000000e6]'
            }`}
          >
            Network
            {activeTab === 'network' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01754f]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'jobs'
                ? 'text-[#01754f]'
                : 'text-[#0000009a] hover:text-[#000000e6]'
            }`}
          >
            Jobs
            {activeTab === 'jobs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01754f]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'groups'
                ? 'text-[#01754f]'
                : 'text-[#0000009a] hover:text-[#000000e6]'
            }`}
          >
            Groups
            {activeTab === 'groups' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01754f]"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          {activeTab === 'network' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-[#000000e6]">Recommended for You</h3>
              </div>
              <p className="text-xs text-[#0000009a] mb-3">Based on Your Recent Activity</p>
              <button className="text-xs text-[#0000009a] hover:text-[#0a66c2] hover:underline font-semibold mb-4">
                See more
              </button>
              
              <div className="space-y-4">
                {recommendedUsers.map((user) => (
                  <div key={user.id} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-[#000000e6] hover:text-[#0a66c2] hover:underline cursor-pointer truncate">
                        {user.name}
                      </h4>
                      <p className="text-xs text-[#0000009a] truncate leading-[1.4]">{user.role}</p>
                      <p className="text-xs text-[#0000009a] mt-1">{user.mutualConnections} mutuals</p>
                    </div>
                    <button className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a66c2] hover:bg-[#e8f4fb] flex items-center justify-center transition-colors mt-1">
                      <UserPlus className="w-4 h-4 text-[#0a66c2]" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#00000024]">
                <h4 className="text-base font-semibold text-[#000000e6] mb-1">
                  People you may know from NYU
                </h4>
                <button className="text-xs text-[#0000009a] hover:text-[#0a66c2] hover:underline font-semibold mb-4">
                  See more
                </button>
                
                <div className="space-y-4">
                  {nyuUsers.map((user) => (
                    <div key={user.id} className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#000000e6] hover:text-[#0a66c2] hover:underline cursor-pointer truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[#0000009a] truncate leading-[1.4]">{user.role}</p>
                        <p className="text-xs text-[#0000009a] mt-1">{user.mutualConnections} mutuals</p>
                      </div>
                      <button className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a66c2] hover:bg-[#e8f4fb] flex items-center justify-center transition-colors mt-1">
                        <UserPlus className="w-4 h-4 text-[#0a66c2]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#00000024]">
                <h4 className="text-base font-semibold text-[#000000e6] mb-1">Add to your feed</h4>
                <button className="text-xs text-[#0000009a] hover:text-[#0a66c2] hover:underline font-semibold mb-4">
                  See more
                </button>
                
                <div className="space-y-4">
                  {companies.map((company, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#94a3b8] to-[#64748b] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {company.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#000000e6] hover:text-[#0a66c2] hover:underline cursor-pointer truncate">
                          {company.name}
                        </h4>
                        <p className="text-xs text-[#0000009a] truncate leading-[1.4]">{company.category}</p>
                        <p className="text-xs text-[#0000009a] mt-1">{company.followers}</p>
                      </div>
                      <button className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a66c2] hover:bg-[#e8f4fb] flex items-center justify-center transition-colors mt-1">
                        <UserPlus className="w-4 h-4 text-[#0a66c2]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'jobs' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-[#000000e6]">Recommended Jobs</h3>
                <button className="text-xs text-[#0a66c2] hover:underline font-semibold">See all</button>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg hover:bg-[#0000000a] transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm text-[#000000e6] mb-1">UI/UX Designer</h4>
                  <p className="text-xs text-[#0000009a] mb-1">Google • Remote</p>
                  <p className="text-xs text-[#0000009a]">Posted 2 days ago</p>
                </div>
                <div className="p-3 rounded-lg hover:bg-[#0000000a] transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm text-[#000000e6] mb-1">Frontend Developer</h4>
                  <p className="text-xs text-[#0000009a] mb-1">Meta • Hybrid</p>
                  <p className="text-xs text-[#0000009a]">Posted 4 days ago</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'groups' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-[#000000e6]">Suggested Groups</h3>
                <button className="text-xs text-[#0a66c2] hover:underline font-semibold">Discover</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[#000000e6] hover:text-[#0a66c2] hover:underline cursor-pointer truncate">
                      IIT Madras Alumni
                    </h4>
                    <p className="text-xs text-[#0000009a]">1,234 members</p>
                  </div>
                  <button className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#0a66c2] hover:bg-[#e8f4fb] flex items-center justify-center transition-colors">
                    <UserPlus className="w-4 h-4 text-[#0a66c2]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

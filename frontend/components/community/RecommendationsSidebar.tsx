"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserPlus, Bell } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Recommendations Card */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Tabs */}
        <div className="flex border-b border-[#e5e7eb]">
          <button
            onClick={() => setActiveTab('network')}
            className={`flex-1 py-3.5 text-xs font-semibold transition-all relative ${
              activeTab === 'network'
                ? 'text-[#0a66c2]'
                : 'text-[#666] hover:text-[#191919]'
            }`}
          >
            Network
            {activeTab === 'network' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a66c2] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-3.5 text-xs font-semibold transition-all relative ${
              activeTab === 'jobs'
                ? 'text-[#0a66c2]'
                : 'text-[#666] hover:text-[#191919]'
            }`}
          >
            Jobs
            {activeTab === 'jobs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a66c2] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3.5 text-xs font-semibold transition-all relative ${
              activeTab === 'groups'
                ? 'text-[#0a66c2]'
                : 'text-[#666] hover:text-[#191919]'
            }`}
          >
            Groups
            {activeTab === 'groups' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a66c2] rounded-t-full"></div>
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
                    <button className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-[#0a66c2] hover:bg-[#e8f4fb] flex items-center justify-center transition-all hover:scale-105 mt-1">
                      <UserPlus className="w-4 h-4 text-[#0a66c2]" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#00000024]">
                <h4 className="text-base font-semibold text-[#000000e6] mb-1">
                  Important Notifications
                </h4>
                <Link href="/community/notifications" className="text-xs text-[#0000009a] hover:text-[#0a66c2] hover:underline font-semibold mb-4 inline-block">
                  See all
                </Link>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 hover:bg-[#0000000a] -mx-3 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-[#000000e6]">Rajesh Kumar</span>
                        <span className="text-[10px] text-[#00000099]">•</span>
                        <span className="text-[10px] text-[#00000099]">Secretary</span>
                      </div>
                      <p className="text-xs text-[#000000e6] leading-[1.4] line-clamp-2">Annual General Meeting scheduled for March 15th at 6 PM in the community hall.</p>
                      <span className="text-[10px] text-[#00000099] mt-1 inline-block">2h ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 hover:bg-[#0000000a] -mx-3 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-[#000000e6]">Priya Sharma</span>
                        <span className="text-[10px] text-[#00000099]">•</span>
                        <span className="text-[10px] text-[#00000099]">Deputy Secretary</span>
                      </div>
                      <p className="text-xs text-[#000000e6] leading-[1.4] line-clamp-2">Reminder: Monthly maintenance dues are due by the 5th of each month.</p>
                      <span className="text-[10px] text-[#00000099] mt-1 inline-block">1d ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 hover:bg-[#0000000a] -mx-3 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-[#000000e6]">Rajesh Kumar</span>
                        <span className="text-[10px] text-[#00000099]">•</span>
                        <span className="text-[10px] text-[#00000099]">Secretary</span>
                      </div>
                      <p className="text-xs text-[#000000e6] leading-[1.4] line-clamp-2">Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance.</p>
                      <span className="text-[10px] text-[#00000099] mt-1 inline-block">3d ago</span>
                    </div>
                  </div>
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

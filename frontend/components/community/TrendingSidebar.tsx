"use client";

import { Hash, TrendingUp } from 'lucide-react';

export default function TrendingSidebar() {
  const trending = [
    { tag: 'IITMadras', posts: 234 },
    { tag: 'NamdaphaHouse', posts: 189 },
    { tag: 'BSDegree', posts: 156 },
    { tag: 'StudyTips', posts: 142 },
    { tag: 'CampusLife', posts: 128 },
  ];

  return (
    <div className="sticky top-20 space-y-4">
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
        <h3 className="text-sm font-semibold text-[#121317] flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
          Trending Topics
        </h3>
        <div className="space-y-1.5">
          {trending.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="text-sm font-medium text-[#121317]">{item.tag}</span>
              </div>
              <span className="text-[10px] text-[#6B7280]">{item.posts} posts</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#4F46E5] rounded-lg p-4 text-white">
        <h3 className="text-sm font-semibold mb-1.5">Community Guidelines</h3>
        <p className="text-xs text-white/90 leading-relaxed">
          Be respectful, stay on topic, and help create a positive environment for everyone.
        </p>
      </div>
    </div>
  );
}

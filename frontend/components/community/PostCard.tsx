"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ThumbsUp, MessageCircle, Repeat2, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post } from '@/lib/communityService';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isLiked?: boolean;
  currentUserId?: string;
}

export default function PostCard({ post, onLike, onComment, onDelete, isLiked = false, currentUserId }: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-[#d4d4d4] overflow-hidden shadow-sm">
      {/* Post Header */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {post.userImage ? (
              <Image 
                src={post.userImage} 
                alt={post.username} 
                width={48} 
                height={48} 
                className="rounded-full object-cover" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#6b7280] flex items-center justify-center">
                <span className="text-white font-semibold text-base">{post.username[0].toUpperCase()}</span>
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#000000e6] hover:text-[#0a66c2] hover:underline cursor-pointer truncate">
                  {post.username}
                </h3>
                {post.userId === currentUserId && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs bg-[#0a66c2] text-white px-1.5 py-0.5 rounded">Author</span>
                  </div>
                )}
                <p className="text-xs text-[#0000009a] leading-tight truncate mt-0.5">
                  Motion Graphic Artist & Visual Design Expert
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-xs text-[#0000009a]">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
                  <span className="text-xs text-[#0000009a]">·</span>
                  <svg className="w-3 h-3 text-[#0000009a]" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Dot Menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-1.5 hover:bg-[#0000000a] rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-[#0000009a]" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white border border-[#d4d4d4] shadow-lg overflow-hidden z-10">
              <button className="w-full px-4 py-2.5 text-left text-sm text-[#000000e6] hover:bg-[#0000000a] transition-colors flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Save post
              </button>
              {currentUserId === post.userId && onDelete && (
                <>
                  <div className="border-t border-[#00000024]"></div>
                  <button
                    onClick={() => {
                      onDelete(post.id!);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#d11124] hover:bg-[#fef2f2] transition-colors"
                  >
                    Delete post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-sm text-[#000000e6] leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
        {post.content.length > 200 && (
          <button className="text-xs text-[#0000009a] hover:text-[#0a66c2] font-semibold mt-1">
            ...Read more
          </button>
        )}
      </div>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className={`${post.imageUrls.length === 1 ? 'mt-2' : 'px-4 pb-2 mt-2'}`}>
          {post.imageUrls.length === 1 ? (
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image 
                src={post.imageUrls[0]} 
                alt="Post image" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          ) : (
            <div className={`grid gap-1 ${post.imageUrls.length === 2 ? 'grid-cols-2' : post.imageUrls.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {post.imageUrls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <Image 
                    src={url} 
                    alt={`Post image ${index + 1}`} 
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                  {index === 3 && post.imageUrls!.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded">
                      <span className="text-white text-2xl font-semibold">+{post.imageUrls!.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Engagement Stats */}
      {(post.likes > 0 || post.comments > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-[#0000009a]">
          <div className="flex items-center gap-1.5">
            {post.likes > 0 && (
              <div className="flex items-center gap-1 cursor-pointer hover:underline hover:text-[#0a66c2]">
                <div className="flex items-center -space-x-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center border border-white">
                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#df704d] flex items-center justify-center border border-white">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 12l-4-4h8z" />
                    </svg>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#6dae4f] flex items-center justify-center border border-white">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="8" r="3" />
                    </svg>
                  </div>
                </div>
                <span>{post.likes}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {post.comments > 0 && (
              <span className="cursor-pointer hover:underline hover:text-[#0a66c2]">
                {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#00000024] mx-4"></div>

      {/* Action Buttons */}
      <div className="px-1 py-1 flex items-center">
        <button 
          onClick={() => onLike(post.id!)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md transition-colors ${
            isLiked 
              ? 'text-[#0a66c2] hover:bg-[#e8f4fb]' 
              : 'text-[#0000009a] hover:bg-[#0000000a]'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-[#0a66c2]' : ''}`} />
          <span className="text-sm font-semibold">Like</span>
        </button>
        
        <button 
          onClick={() => onComment(post.id!)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-[#0000009a] hover:bg-[#0000000a] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">Comment</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-[#0000009a] hover:bg-[#0000000a] transition-colors">
          <Repeat2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Repost</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-md text-[#0000009a] hover:bg-[#0000000a] transition-colors">
          <Send className="w-5 h-5" />
          <span className="text-sm font-semibold">Share</span>
        </button>
      </div>
    </div>
  );
}

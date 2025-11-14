"use client";

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Post } from '@/lib/communityService';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onUpdate: () => void;
}

export default function EditPostModal({ isOpen, onClose, post, onUpdate }: EditPostModalProps) {
  const [content, setContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    if (!content.trim()) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/community/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) throw new Error('Failed to update post');
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl">
        <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#191919]">Edit post</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f3f6f8] rounded-full transition-colors">
            <X className="w-5 h-5 text-[#666]" />
          </button>
        </div>

        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] text-sm text-[#191919] placeholder-[#666] resize-none border-none outline-none"
            placeholder="What do you want to talk about?"
            autoFocus
          />
        </div>

        <div className="p-4 border-t border-[#e5e7eb] flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-[#191919] border border-[#e5e7eb] hover:bg-[#f3f6f8] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !content.trim()}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

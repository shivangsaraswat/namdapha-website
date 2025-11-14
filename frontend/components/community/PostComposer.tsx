"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon, Video, Calendar, FileText, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/cloudinary';

interface PostComposerProps {
  user: {
    id: string;
    username: string;
    name: string;
    image?: string;
  };
  onPostCreated: () => void;
  editingPost?: any;
  onCancelEdit?: () => void;
}

export default function PostComposer({ user, onPostCreated, editingPost, onCancelEdit }: PostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
      setIsExpanded(true);
    }
  }, [editingPost]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setMediaFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setMediaPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(mediaPreviewUrls[index]);
    setMediaPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    setIsUploading(true);
    try {
      if (editingPost) {
        // Update existing post
        const response = await fetch(`/api/community/posts/${editingPost.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content.trim() }),
        });

        if (!response.ok) throw new Error('Failed to update post');
        
        if (onCancelEdit) onCancelEdit();
      } else {
        // Upload media files to Cloudinary
        const uploadedUrls: string[] = [];
        for (const file of mediaFiles) {
          const result = await uploadImage(file, 'community');
          const url = typeof result === 'string' ? result : result.url;
          uploadedUrls.push(url);
        }

        // Create post
        const response = await fetch('/api/community/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            imageUrls: uploadedUrls,
          }),
        });

        if (!response.ok) throw new Error('Failed to create post');
      }

      // Reset form
      setContent('');
      setMediaFiles([]);
      mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setMediaPreviewUrls([]);
      setIsExpanded(false);
      
      onPostCreated();
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (isExpanded) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-md">
        {/* Header */}
        <div className="p-4 border-b border-[#00000024] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name} 
                width={48} 
                height={48} 
                className="rounded-full object-cover w-12 h-12" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#6b7280] flex items-center justify-center">
                <span className="text-white font-semibold text-base">{user.name[0].toUpperCase()}</span>
              </div>
            )}
            <span className="text-sm font-semibold text-[#000000e6]">{editingPost ? 'Edit post' : user.name}</span>
          </div>
          <button 
            onClick={() => {
              setIsExpanded(false);
              setContent('');
              setMediaFiles([]);
              mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
              setMediaPreviewUrls([]);
              if (editingPost && onCancelEdit) onCancelEdit();
            }}
            className="p-2 hover:bg-[#0000000a] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#0000009a]" />
          </button>
        </div>

        {/* Textarea */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-[120px] text-sm text-[#000000e6] placeholder-[#0000009a] resize-none border-none outline-none"
            autoFocus
          />

          {/* Media Preview */}
          {mediaPreviewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mediaPreviewUrls.map((url, index) => (
                <div key={index} className="relative aspect-video bg-[#f3f2f0] rounded overflow-hidden">
                  <Image 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-[#f3f2f0] transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4 text-[#000000]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#00000024] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-[#0000000a] rounded-full transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-[#70b5f9]" />
            </button>
            <button className="p-2 hover:bg-[#0000000a] rounded-full transition-colors">
              <Video className="w-5 h-5 text-[#7fc15e]" />
            </button>
            <button className="p-2 hover:bg-[#0000000a] rounded-full transition-colors">
              <Calendar className="w-5 h-5 text-[#e7a33e]" />
            </button>
            <button className="p-2 hover:bg-[#0000000a] rounded-full transition-colors">
              <FileText className="w-5 h-5 text-[#fc9295]" />
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
            className="px-6 py-2 bg-[#0a66c2] text-white text-sm font-semibold rounded-full hover:bg-[#004182] disabled:bg-[#0000001a] disabled:text-[#00000061] disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? (editingPost ? 'Updating...' : 'Posting...') : (editingPost ? 'Update' : 'Post')}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Input Section */}
      <div className="flex items-start gap-2">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name} 
              width={48} 
              height={48} 
              className="rounded-full object-cover w-12 h-12" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#6b7280] flex items-center justify-center">
              <span className="text-white font-semibold text-base">{user.name[0].toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full px-5 py-3.5 text-left text-sm text-[#666] font-medium bg-white border border-[#e5e7eb] rounded-full hover:bg-[#f3f6f8] transition-all"
          >
            Start a post...
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 mt-2.5">
        <button 
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => fileInputRef.current?.click(), 100);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#0000000a] transition-colors"
        >
          <ImageIcon className="w-5 h-5 text-[#70b5f9]" />
          <span className="text-sm font-semibold text-[#0000009a]">Media</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#0000000a] transition-colors">
          <Video className="w-5 h-5 text-[#7fc15e]" />
          <span className="text-sm font-semibold text-[#0000009a]">Video</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#0000000a] transition-colors">
          <Calendar className="w-5 h-5 text-[#e7a33e]" />
          <span className="text-sm font-semibold text-[#0000009a]">Event</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md hover:bg-[#0000000a] transition-colors">
          <FileText className="w-5 h-5 text-[#fc9295]" />
          <span className="text-sm font-semibold text-[#0000009a]">Write article</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleMediaSelect}
        className="hidden"
      />
    </div>
  );
}

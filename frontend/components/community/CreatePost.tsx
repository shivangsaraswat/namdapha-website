"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import { communityService } from '@/lib/communityService';
import { uploadImage } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface CreatePostProps {
  user: { id: string; username: string; image?: string };
  onPostCreated: () => void;
}

export default function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + mediaFiles.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    setMediaFiles([...mediaFiles, ...files]);
  };

  const removeImage = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of mediaFiles) {
        const result = await uploadImage(file, 'community');
        uploadedUrls.push(result.url);
      }

      await communityService.createPost({
        userId: user.id,
        username: user.username,
        userImage: user.image,
        content: content.trim(),
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        linkUrl: linkUrl.trim() || undefined
      });

      setContent('');
      setMediaFiles([]);
      setLinkUrl('');
      onPostCreated();
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.image ? (
            <Image src={user.image} alt={user.username} width={40} height={40} className="object-cover rounded-full w-10 h-10" />
          ) : (
            <span className="text-white font-semibold">{user.username[0].toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[80px] p-3 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-transparent resize-none placeholder:text-[#9CA3AF] transition-all"
          />

          {mediaFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {mediaFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-[#F3F4F6]">
                  <Image src={URL.createObjectURL(file)} alt="" fill className="object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="p-1.5 hover:bg-[#F9FAFB] rounded-lg cursor-pointer transition-colors">
                <ImageIcon className="w-5 h-5 text-[#6B7280]" />
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
              <button className="p-1.5 hover:bg-[#F9FAFB] rounded-lg transition-colors">
                <LinkIcon className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={loading || (!content.trim() && mediaFiles.length === 0)}
              className="px-5 py-1.5 text-sm bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { communityService, Post } from '@/lib/communityService';
import PostCard from '@/components/community/PostCard';
import { Loader2 } from 'lucide-react';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/community/signin');
      return;
    }
    loadPost();
  }, [params.postId, session]);

  const loadPost = async () => {
    try {
      const postData = await communityService.getPostById(params.postId as string);
      if (!postData) {
        router.push('/community');
        return;
      }
      setPost(postData);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[680px] mx-auto px-6 py-6">
        <PostCard
          post={post}
          onLike={() => {}}
          onComment={() => {}}
          currentUserId={session?.user?.email}
        />
      </div>
    </div>
  );
}

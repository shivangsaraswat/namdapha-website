"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { communityService, Post, CommunityUser } from '@/lib/communityService';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/redisCache';
import PostCard from '@/components/community/PostCard';
import PostComposer from '@/components/community/PostComposer';
import AuthModal from '@/components/community/AuthModal';
import ProfileSidebar from '@/components/community/ProfileSidebar';
import RecommendationsSidebar from '@/components/community/RecommendationsSidebar';
import EditProfileModal from '@/components/community/EditProfileModal';
import { Loader2 } from 'lucide-react';

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [communityUser, setCommunityUser] = useState<CommunityUser | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFeed();
    if (session?.user?.email) {
      loadCommunityUser();
    }
  }, [session]);

  const loadFeed = async () => {
    try {
      const cached = await cache.get<Post[]>(CACHE_KEYS.FEED(1));
      if (cached) {
        setPosts(cached);
        setLoading(false);
        return;
      }

      const { posts: fetchedPosts } = await communityService.getFeed(20);
      await cache.set(CACHE_KEYS.FEED(1), fetchedPosts, CACHE_TTL.FEED);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityUser = async () => {
    if (!session?.user?.email) return;
    try {
      let user = await communityService.getUserByEmail(session.user.email);
      
      if (!user) {
        const authorized = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email })
        }).then(r => r.json());

        if (authorized.allowed) {
          await communityService.createUser(
            session.user.email,
            session.user.name || session.user.email.split('@')[0],
            session.user.image || undefined
          );
          user = await communityService.getUserByEmail(session.user.email);
        }
      }
      
      setCommunityUser(user);
    } catch (error) {
      console.error('Error loading community user:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!communityUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isLiked = await communityService.toggleLike(postId, communityUser.id!);
      if (isLiked) {
        setLikedPosts(new Set([...likedPosts, postId]));
      } else {
        const newLiked = new Set(likedPosts);
        newLiked.delete(postId);
        setLikedPosts(newLiked);
      }
      
      await cache.delete(CACHE_KEYS.FEED(1));
      loadFeed();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = (postId: string) => {
    if (!communityUser) {
      setShowAuthModal(true);
      return;
    }
    // TODO: Open comment modal
  };

  const handlePostCreated = async () => {
    await cache.delete(CACHE_KEYS.FEED(1));
    loadFeed();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2f0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f3f2ef]">
        <div className="max-w-[1128px] mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Profile */}
            <div className="hidden lg:block lg:col-span-3">
              <ProfileSidebar 
                user={communityUser} 
                onEditProfile={() => setShowEditProfile(true)}
              />
            </div>

            {/* Main Feed */}
            <div className="col-span-12 lg:col-span-6 space-y-2">
              {communityUser && (
                <PostComposer
                  user={{
                    id: communityUser.id!,
                    username: communityUser.username,
                    name: communityUser.name,
                    image: communityUser.profileImage
                  }}
                  onPostCreated={handlePostCreated}
                />
              )}

              <div className="space-y-2">
                {posts.length === 0 ? (
                  <div className="bg-white rounded-lg border border-[#d4d4d4] p-12 text-center shadow-sm">
                    <p className="text-[#0000009a]">No posts yet. Be the first to share something!</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onDelete={async (postId) => {
                        await communityService.deletePost(postId, communityUser?.id!);
                        await cache.delete(CACHE_KEYS.FEED(1));
                        loadFeed();
                      }}
                      isLiked={likedPosts.has(post.id!)}
                      currentUserId={communityUser?.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar - Recommendations */}
            <div className="hidden lg:block lg:col-span-3">
              <RecommendationsSidebar />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          loadCommunityUser();
        }}
      />

      {communityUser && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={communityUser}
          onUpdate={loadCommunityUser}
        />
      )}
    </>
  );
}

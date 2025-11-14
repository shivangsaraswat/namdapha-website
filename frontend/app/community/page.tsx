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
import EditPostModal from '@/components/community/EditPostModal';
import { Loader2 } from 'lucide-react';

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [communityUser, setCommunityUser] = useState<CommunityUser | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (communityUser?.id) {
      loadLikedPosts();
    }
  }, [communityUser]);

  const loadLikedPosts = async () => {
    if (!communityUser?.email) return;
    try {
      const liked = new Set<string>();
      for (const post of posts) {
        if (post.id) {
          const hasLiked = await communityService.hasLiked(post.id, communityUser.email);
          if (hasLiked) liked.add(post.id);
        }
      }
      setLikedPosts(liked);
    } catch (error) {
      console.error('Error loading liked posts:', error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/community/signin';
      return;
    }
    if (status === 'authenticated') {
      loadFeed();
      if (session?.user?.email) {
        loadCommunityUser();
      }
    }
  }, [session, status]);

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
          window.location.href = '/community/onboarding';
          return;
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
      const isLiked = await communityService.toggleLike(postId, communityUser.email);
      const newLiked = new Set(likedPosts);
      if (isLiked) {
        newLiked.add(postId);
      } else {
        newLiked.delete(postId);
      }
      setLikedPosts(newLiked);
      
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#f3f2f0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fa]">
        {/* Fixed Left Sidebar */}
        <div className="hidden lg:block fixed left-[max(24px,calc((100vw-1280px)/2+24px))] top-[56px] w-[280px] h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide">
          <div className="pt-6">
            <ProfileSidebar 
              user={communityUser} 
              onEditProfile={() => setShowEditProfile(true)}
            />
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-12 gap-6 py-6">
            {/* Spacer for fixed sidebar */}
            <div className="hidden lg:block lg:col-span-3"></div>

            {/* Main Feed */}
            <div className="col-span-12 lg:col-span-6 space-y-4 pb-24">
              {communityUser && (
                <PostComposer
                  user={{
                    id: communityUser.id!,
                    username: communityUser.username,
                    name: communityUser.name,
                    image: communityUser.profileImage || session?.user?.image
                  }}
                  onPostCreated={handlePostCreated}
                  editingPost={editingPost}
                  onCancelEdit={() => setEditingPost(null)}
                />
              )}

              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center shadow-sm">
                    <p className="text-[#666]">No posts yet. Be the first to share something!</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onEdit={(postId) => {
                        const postToEdit = posts.find(p => p.id === postId);
                        if (postToEdit) {
                          setEditingPost(postToEdit);
                        }
                      }}
                      onShare={(postId) => {
                        const post = posts.find(p => p.id === postId);
                        if (post) {
                          const slug = post.userSlug || post.userId.split('@')[0];
                          const url = `${window.location.origin}/community/in/${slug}/post/${postId}`;
                          navigator.clipboard.writeText(url);
                          alert('Post link copied to clipboard!');
                        }
                      }}
                      onDelete={async (postId) => {
                        await communityService.deletePost(postId, communityUser?.id!);
                        await cache.delete(CACHE_KEYS.FEED(1));
                        loadFeed();
                      }}
                      onSave={(postId) => {
                        setSavedPosts(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(postId)) {
                            newSet.delete(postId);
                          } else {
                            newSet.add(postId);
                          }
                          return newSet;
                        });
                      }}
                      isLiked={likedPosts.has(post.id!)}
                      isSaved={savedPosts.has(post.id!)}
                      currentUserId={communityUser?.email}
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

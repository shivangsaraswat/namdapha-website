"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { communityService, CommunityUser, Post } from '@/lib/communityService';
import { messagingService } from '@/lib/messagingService';
import { MapPin, Globe, Loader2, UserPlus, UserMinus, MessageCircle } from 'lucide-react';
import MessagingModal from '@/components/community/MessagingModal';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<CommunityUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [canMessage, setCanMessage] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showMessageWarning, setShowMessageWarning] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [params.slug, session]);

  const loadProfile = async () => {
    try {
      let userData = await communityService.getUserBySlug(params.slug as string);
      if (!userData) {
        userData = await communityService.getUserByUsername(params.slug as string);
      }
      if (!userData) {
        return;
      }
      setUser(userData);
      const userPosts = await communityService.getUserPosts(userData.email);
      setPosts(userPosts);
      
      console.log('Session email:', session?.user?.email);
      console.log('Profile email:', userData.email);
      console.log('Are different?', session?.user?.email !== userData.email);
      
      if (session?.user?.email && session.user.email !== userData.email) {
        const status = await communityService.getFollowStatus(session.user.email, userData.email);
        setFollowStatus(status);
        const mutual = await communityService.areMutualFollowers(session.user.email, userData.email);
        setCanMessage(mutual);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.email || !user) return;
    try {
      if (followStatus === 'accepted' || followStatus === 'pending') {
        await communityService.unfollowUser(session.user.email, user.email);
        setFollowStatus('none');
        setCanMessage(false);
      } else {
        await communityService.followUser(session.user.email, user.email);
        setFollowStatus('pending');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleMessage = async () => {
    if (!session?.user?.email || !user) return;
    setShowMessaging(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-[#666]">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[1128px] mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden mb-4">
          <div className="h-48 relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
            {user.coverImage && <Image src={user.coverImage} alt="Cover" fill className="object-cover" />}
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between -mt-16 mb-4">
              <div className="relative">
                {user.profileImage ? (
                  <Image src={user.profileImage} alt={user.name} width={160} height={160} className="rounded-full border-4 border-white object-cover w-40 h-40" />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center border-4 border-white">
                    <span className="text-white font-semibold text-5xl">{user.name[0].toUpperCase()}</span>
                  </div>
                )}
              </div>

            </div>
            <h1 className="text-2xl font-bold text-[#191919] mb-1">{user.name}</h1>
            <p className="text-base text-[#666] mb-3">{user.headline || 'Community Member'}</p>
            <div className="flex items-center gap-4 text-sm text-[#666] mb-4">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-[#0a66c2] hover:underline cursor-pointer">{user.website}</span>
                </div>
              )}
            </div>
            {session?.user?.email && session.user.email !== user.email && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
                    followStatus === 'accepted'
                      ? 'border-2 border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f4fb]'
                      : followStatus === 'pending'
                      ? 'border-2 border-[#666] text-[#666] hover:bg-[#f3f6f8]'
                      : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
                  }`}
                >
                  {followStatus === 'accepted' ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {followStatus === 'accepted' ? 'Unfollow' : followStatus === 'pending' ? 'Pending' : 'Follow'}
                </button>
                <button
                  onClick={() => canMessage ? handleMessage() : setShowMessageWarning(true)}
                  className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold border-2 border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f4fb] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
          <h2 className="text-lg font-semibold text-[#191919] mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-[#666] text-center py-8">No posts yet</p>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border-b border-[#e5e7eb] pb-4 last:border-0">
                  <p className="text-sm text-[#191919]">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {session?.user?.email && user && (
        <MessagingModal
          isOpen={showMessaging}
          onClose={() => setShowMessaging(false)}
          currentUserId={session.user.email}
          recipientId={user.email}
        />
      )}

      {showMessageWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMessageWarning(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#fef3e2] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#191919]">Cannot Send Message</h3>
                <p className="text-sm text-[#666]">Mutual connection required</p>
              </div>
            </div>
            <p className="text-sm text-[#666] mb-6">
              You can only message people who follow you back. To message {user?.name}, you both need to follow each other.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageWarning(false)}
                className="flex-1 px-4 py-2 border-2 border-[#e5e7eb] text-[#666] rounded-full font-semibold hover:bg-[#f3f6f8] transition-all"
              >
                Close
              </button>
              {followStatus === 'none' && (
                <button
                  onClick={async () => {
                    setShowMessageWarning(false);
                    await handleFollow();
                  }}
                  className="flex-1 px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold hover:bg-[#004182] transition-all"
                >
                  Follow {user?.name?.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

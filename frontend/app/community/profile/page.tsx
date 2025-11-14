"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { communityService, CommunityUser, Post } from '@/lib/communityService';
import { uploadImage } from '@/lib/cloudinary';
import { MapPin, Globe, Edit, Settings, TrendingUp, Users, Layers, FileText, Pencil, Camera, X, UserMinus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import EditProfileModal from '@/components/community/EditProfileModal';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<CommunityUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState<Array<{email: string, user: any, followStatus?: string}>>([]);
  const [following, setFollowing] = useState<Array<{email: string, user: any}>>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user?.email) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const userData = await communityService.getUserByEmail(session!.user!.email!);
      setUser(userData);
      
      if (userData?.email) {
        const userPosts = await communityService.getUserPosts(userData.email);
        setPosts(userPosts);
        await loadFollowersAndFollowing(userData.email);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowersAndFollowing = async (email: string) => {
    const followersList = await communityService.getFollowers(email);
    const followingList = await communityService.getFollowing(email);
    
    const followersWithStatus = await Promise.all(
      followersList.map(async (f) => {
        const status = await communityService.getFollowStatus(email, f.email);
        return { ...f, followStatus: status };
      })
    );
    
    setFollowers(followersWithStatus);
    setFollowing(followingList);
  };

  const handleImageUpload = async (file: File, type: 'cover' | 'profile') => {
    if (!user?.id) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, 'community');
      const url = typeof result === 'string' ? result : result.url;
      
      const updates = type === 'cover' ? { coverImage: url } : { profileImage: url };
      await communityService.updateUser(user.id, updates);
      await loadProfile();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
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
        <p>Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[1128px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden mb-4">
              {/* Cover Image */}
              <div className="h-48 relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                {user.coverImage && (
                  <Image src={user.coverImage} alt="Cover" fill className="object-cover" />
                )}
                <button 
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#191919] hover:bg-[#f3f6f8] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  Change Image
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="px-6 pb-6">
                <div className="flex items-start justify-between -mt-16 mb-4">
                  <div className="relative group">
                    <button
                      onClick={() => profileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-[#f3f6f8] transition-colors z-10 disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4 text-[#666]" />
                    </button>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profile')}
                      className="hidden"
                    />
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name}
                        width={160}
                        height={160}
                        className="rounded-full border-4 border-white object-cover w-40 h-40"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center border-4 border-white">
                        <span className="text-white font-semibold text-5xl">
                          {user.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="mt-20 px-6 py-2 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-[#191919] mb-1">{user.name}</h1>
                  {user.headline && (
                    <p className="text-base text-[#666] mb-3">
                      {user.headline}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-[#666] mb-3">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-[#0a66c2] hover:underline cursor-pointer">
                          {user.website}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <button onClick={() => setShowFollowersModal(true)} className="hover:underline">
                      <span className="text-base font-semibold text-[#191919]">
                        {followers.length}
                      </span>
                      <span className="text-sm text-[#666] ml-1">Followers</span>
                    </button>
                    <button onClick={() => setShowFollowingModal(true)} className="hover:underline">
                      <span className="text-base font-semibold text-[#191919]">
                        {following.length}
                      </span>
                      <span className="text-sm text-[#666] ml-1">Following</span>
                    </button>
                  </div>

                  <button className="px-6 py-2 bg-white border border-[#0a66c2] text-[#0a66c2] rounded-full text-sm font-semibold hover:bg-[#e8f4fb] transition-colors">
                    Open to Hiring
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#e5e7eb]">
                  <Link href="/community/settings" className="flex items-center gap-2 px-4 py-2 bg-[#f3f6f8] rounded-lg text-sm font-semibold text-[#666] hover:bg-[#e5e7eb] transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings & Privacy
                  </Link>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-[#fef3e2] rounded-lg text-sm font-semibold text-[#191919] hover:bg-[#fde9c9] transition-colors"
                  >
                    Enhance Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#191919] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Analytics
                </h2>
                <button className="text-sm text-[#666] hover:text-[#0a66c2]">See more</button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-semibold text-[#191919] mb-1">{user.stats?.profileViews || 0}</div>
                  <div className="text-sm text-[#666]">Profile Views</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[#191919] mb-1">{user.stats?.postImpressions?.toLocaleString() || 0}</div>
                  <div className="text-sm text-[#666]">Post Impressions</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[#191919] mb-1">{user.stats?.posts || 0}</div>
                  <div className="text-sm text-[#666]">Total Posts</div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#191919]">About</h2>
                <button className="p-2 hover:bg-[#f3f6f8] rounded-full transition-colors">
                  <Pencil className="w-4 h-4 text-[#666]" />
                </button>
              </div>
              {user.bio && (
                <p className="text-sm text-[#191919] leading-relaxed whitespace-pre-wrap">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Featured Section */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#191919]">Featured</h2>
                <button className="p-2 hover:bg-[#f3f6f8] rounded-full transition-colors">
                  <Pencil className="w-4 h-4 text-[#666]" />
                </button>
              </div>
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="border border-[#e5e7eb] rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      {post.imageUrls && post.imageUrls[0] && (
                        <div className="relative aspect-video">
                          <Image src={post.imageUrls[0]} alt="Post" fill className="object-cover" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-xs text-[#666] line-clamp-2">{post.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#666] text-center py-8">No featured posts yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
              <Link href="/community/mynetwork" className="block px-4 py-3 text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors flex items-center gap-3">
                <Users className="w-4 h-4 text-[#666]" />
                <span className="font-semibold">My Network</span>
              </Link>
              <div className="border-t border-[#e5e7eb]"></div>
              <button className="w-full px-4 py-3 text-left text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#666]" />
                <span className="font-semibold">Groups</span>
              </button>
              <div className="border-t border-[#e5e7eb]"></div>
              <button className="w-full px-4 py-3 text-left text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#666]" />
                <span className="font-semibold">Newsletters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onUpdate={loadProfile}
        />
      )}

      {showFollowersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFollowersModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#191919]">Followers</h2>
              <button onClick={() => setShowFollowersModal(false)} className="p-2 hover:bg-[#f3f6f8] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {followers.length === 0 ? (
                <p className="text-center text-[#666] py-8">No followers yet</p>
              ) : (
                <div className="space-y-4">
                  {followers.map((f) => (
                    <div key={f.email} className="flex items-start gap-3 py-2">
                      {f.user.profileImage ? (
                        <Image src={f.user.profileImage} alt={f.user.name} width={48} height={48} className="rounded-full object-cover w-12 h-12 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">{f.user.name[0].toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#191919] truncate">{f.user.name}</p>
                        <p className="text-sm text-[#666] truncate">{f.user.headline || 'Community Member'}</p>
                        <div className="flex gap-2 mt-2">
                          {f.followStatus === 'none' && (
                            <button
                              onClick={async () => {
                                await communityService.followUser(user!.email, f.email);
                                await loadFollowersAndFollowing(user!.email);
                              }}
                              className="px-4 py-1.5 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182]"
                            >
                              Follow Back
                            </button>
                          )}
                          {f.followStatus === 'pending' && (
                            <button className="px-4 py-1.5 border-2 border-[#666] text-[#666] rounded-full text-sm font-semibold" disabled>
                              Pending
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              await communityService.removeFollower(f.email, user!.email);
                              await loadFollowersAndFollowing(user!.email);
                            }}
                            className="px-4 py-1.5 border-2 border-[#666] text-[#666] rounded-full text-sm font-semibold hover:bg-[#f3f6f8] flex items-center gap-1.5"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFollowingModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#191919]">Following</h2>
              <button onClick={() => setShowFollowingModal(false)} className="p-2 hover:bg-[#f3f6f8] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {following.length === 0 ? (
                <p className="text-center text-[#666] py-8">Not following anyone yet</p>
              ) : (
                <div className="space-y-4">
                  {following.map((f) => (
                    <div key={f.email} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {f.user.profileImage ? (
                          <Image src={f.user.profileImage} alt={f.user.name} width={48} height={48} className="rounded-full object-cover w-12 h-12" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                            <span className="text-white font-semibold">{f.user.name[0].toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#191919]">{f.user.name}</p>
                          <p className="text-sm text-[#666]">{f.user.headline || 'Community Member'}</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await communityService.unfollowUser(user!.email, f.email);
                          setFollowing(prev => prev.filter(follow => follow.email !== f.email));
                          await loadProfile();
                        }}
                        className="px-4 py-2 border-2 border-[#666] text-[#666] rounded-full text-sm font-semibold hover:bg-[#f3f6f8]"
                      >
                        Unfollow
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

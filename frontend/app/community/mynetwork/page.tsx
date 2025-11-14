"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { communityService, CommunityUser } from '@/lib/communityService';
import { notificationService } from '@/lib/notificationService';
import { Loader2, UserPlus, Check, X } from 'lucide-react';
import ProfileSidebar from '@/components/community/ProfileSidebar';

export default function MyNetworkPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CommunityUser | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Array<{id: string, user: CommunityUser, createdAt: Date}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session === null) {
      router.push('/community/signin');
      return;
    }
    if (session?.user?.email) {
      loadRequests();
    }
  }, [session]);

  const loadRequests = async () => {
    if (!session?.user?.email) return;
    try {
      const user = await communityService.getUserByEmail(session.user.email);
      setCurrentUser(user);
      
      const requests = await communityService.getPendingFollowRequests(session.user.email);
      const requestsWithUsers = await Promise.all(
        requests.map(async (req) => {
          const user = await communityService.getUserByEmail(req.followerId);
          return { ...req, user: user! };
        })
      );
      setPendingRequests(requestsWithUsers.filter(r => r.user));
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (followerId: string) => {
    if (!session?.user?.email) return;
    try {
      await communityService.acceptFollowRequest(followerId, session.user.email);
      setPendingRequests(prev => prev.filter(r => r.user.email !== followerId));
      await loadRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (followerId: string) => {
    if (!session?.user?.email) return;
    try {
      await communityService.rejectFollowRequest(followerId, session.user.email);
      setPendingRequests(prev => prev.filter(r => r.user.email !== followerId));
      await loadRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.email && pendingRequests.length > 0) {
      notificationService.markAllAsRead(session.user.email);
    }
  }, [pendingRequests, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[1128px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-[88px]">
              <ProfileSidebar user={currentUser} />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb]">
            <h1 className="text-xl font-semibold text-[#191919] flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              My Network
            </h1>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#191919] mb-4">
              Follow Requests ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-[#666] mx-auto mb-3" />
                <p className="text-sm text-[#666]">No pending follow requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-[#e5e7eb] rounded-xl hover:bg-[#f8f9fa] transition-colors">
                    <div className="flex items-center gap-3">
                      <Link href={`/community/in/${request.user.profileSlug}`}>
                        {request.user.profileImage ? (
                          <Image
                            src={request.user.profileImage}
                            alt={request.user.name}
                            width={56}
                            height={56}
                            className="rounded-full object-cover w-14 h-14"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                            <span className="text-white font-semibold text-xl">
                              {request.user.name[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </Link>
                      <div>
                        <Link href={`/community/in/${request.user.profileSlug}`} className="font-semibold text-[#191919] hover:underline">
                          {request.user.name}
                        </Link>
                        <p className="text-sm text-[#666]">{request.user.headline || 'Community Member'}</p>
                        {request.user.location && (
                          <p className="text-xs text-[#666] mt-1">{request.user.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(request.user.email)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.user.email)}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-[#666] text-[#666] rounded-full text-sm font-semibold hover:bg-[#f3f6f8] transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

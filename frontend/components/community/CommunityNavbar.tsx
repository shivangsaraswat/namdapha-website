"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Home, Briefcase, Users as UsersIcon, MessageSquare, Bell, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { communityService } from '@/lib/communityService';
import { notificationService } from '@/lib/notificationService';
import MessagingModal from './MessagingModal';
import { dancingScript } from '@/app/fonts';

export default function CommunityNavbar() {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user?.email) {
      communityService.getUserByEmail(session.user.email).then(user => {
        if (user?.profileImage) setUserProfileImage(user.profileImage);
      });
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const loadUnreadCount = async () => {
    if (!session?.user?.email) return;
    const count = await notificationService.getUnreadCount(session.user.email);
    setUnreadCount(count);
  };

  const loadNotifications = async () => {
    if (!session?.user?.email) return;
    const notifs = await notificationService.getUserNotifications(session.user.email);
    if (notifs.length > 10) {
      const toDelete = notifs.slice(10);
      for (const notif of toDelete) {
        await notificationService.deleteNotification(notif.id!);
      }
      setNotifications(notifs.slice(0, 10));
    } else {
      setNotifications(notifs);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      await notificationService.markAsRead(notif.id);
      await loadUnreadCount();
      await loadNotifications();
    }
    setShowNotifications(false);
    if (notif.type === 'follow_request') {
      pathname !== '/community/mynetwork' && (window.location.href = '/community/mynetwork');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/community', icon: Home, text: 'Home' },
    { href: '/community/jobs', icon: Briefcase, text: 'Jobs' },
    { href: '/community/groups', icon: UsersIcon, text: 'Groups' },
  ];

  const isHome = pathname === '/community';

  return (
    <nav className="bg-white border-b border-[#e5e7eb] fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Link href="/community" className="flex items-center gap-2">
              <Image src="/logo-namdapha.png" alt="Namdapha House" width={40} height={40} className="object-contain" priority />
              <span className={`text-xl font-bold text-black ${dancingScript.className}`}>Namdapha House</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.text}
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all ${
                      isActive
                        ? 'text-[#0a66c2]'
                        : 'text-[#666] hover:text-[#0a66c2]'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-xs font-medium">{item.text}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center Section (Search) */}
          <div className="flex-1 flex justify-start px-6 ml-8">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#666]" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-11 pr-4 py-2 border border-[#e5e7eb] rounded-full leading-5 bg-[#f3f6f8] text-[#191919] placeholder-[#666] focus:outline-none focus:bg-white focus:border-[#0a66c2] focus:ring-2 focus:ring-[#e8f4fb] text-sm transition-all"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMessaging(true)} className="relative p-2.5 rounded-lg text-[#666] hover:text-[#0a66c2] hover:bg-[#f3f6f8] transition-all">
              <MessageSquare className="h-5 w-5" />
            </button>

            <div className="relative" ref={notificationMenuRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    setDisplayCount(6);
                    loadNotifications();
                  }
                }}
                className="relative p-2.5 rounded-lg text-[#666] hover:text-[#0a66c2] hover:bg-[#f3f6f8] transition-all"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d11124] text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-3 w-96 rounded-xl shadow-xl bg-white border border-[#e5e7eb] z-50 max-h-[500px] overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#191919]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={async () => {
                          await notificationService.markAllAsRead(session!.user!.email!);
                          await loadUnreadCount();
                          await loadNotifications();
                        }}
                        className="text-xs text-[#0a66c2] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-[#666]">
                        No notifications
                      </div>
                    ) : (
                      <>
                      {notifications.slice(0, displayCount).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full px-4 py-3 text-left hover:bg-[#f3f6f8] transition-colors border-b border-[#e5e7eb] last:border-0 ${
                            !notif.read ? 'bg-[#e8f4fb]' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            {notif.fromUserImage ? (
                              <Image
                                src={notif.fromUserImage}
                                alt={notif.fromUserName}
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-10 h-10 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {notif.fromUserName[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#191919] leading-tight">
                                {notif.message}
                              </p>
                              <p className="text-xs text-[#666] mt-1">
                                {new Date(notif.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-[#0a66c2] flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </button>
                      ))}
                      {displayCount < notifications.length && (
                        <button
                          onClick={() => setDisplayCount(prev => Math.min(prev + 6, notifications.length))}
                          className="w-full px-4 py-3 text-center text-sm text-[#0a66c2] hover:bg-[#f3f6f8] font-semibold border-t border-[#e5e7eb]"
                        >
                          Load more
                        </button>
                      )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {session?.user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center text-sm rounded-full focus:outline-none ring-2 ring-transparent hover:ring-[#0a66c2] transition-all"
                >
                  <Image
                    className="h-9 w-9 rounded-full object-cover"
                    src={userProfileImage || session.user.image || '/default-profile.png'}
                    alt="User profile"
                    width={36}
                    height={36}
                  />
                </button>
                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-3 w-64 rounded-xl shadow-xl py-2 bg-white border border-[#e5e7eb] z-50">
                    <div className="px-4 py-3 border-b border-[#e5e7eb]">
                      <p className="text-sm font-semibold text-[#191919] truncate">{session.user.name}</p>
                      <p className="text-xs text-[#666] truncate mt-0.5">{session.user.email}</p>
                    </div>
                    <Link href="/community/profile" className="block px-4 py-2.5 text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors" onClick={() => setShowProfileMenu(false)}>View Profile</Link>
                    <Link href="/community/settings" className="block px-4 py-2.5 text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors" onClick={() => setShowProfileMenu(false)}>Settings & Privacy</Link>
                    <Link href="/community/help" className="block px-4 py-2.5 text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors" onClick={() => setShowProfileMenu(false)}>Help Center</Link>
                    <Link href="/community/language" className="block px-4 py-2.5 text-sm text-[#191919] hover:bg-[#f3f6f8] transition-colors" onClick={() => setShowProfileMenu(false)}>Language</Link>
                    <div className="border-t border-[#e5e7eb] my-1"></div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        signOut({ callbackUrl: '/community/signin' });
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-[#d11124] hover:bg-[#fef2f2] transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/community/signin" className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors">
                Sign in
              </Link>
            )}

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-[#666] hover:text-[#0a66c2] hover:bg-[#f3f6f8] focus:outline-none transition-all"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {session?.user?.email && (
        <MessagingModal
          isOpen={showMessaging}
          onClose={() => setShowMessaging(false)}
          currentUserId={session.user.email}
        />
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-[#e5e7eb]">
          <div className="px-4 pt-3 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.text}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'text-[#0a66c2] bg-[#e8f4fb]'
                      : 'text-[#666] hover:text-[#0a66c2] hover:bg-[#f3f6f8]'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.text}</span>
                </Link>
              );
            })}
          </div>
          <div className="pt-3 pb-3 border-t border-[#e5e7eb]">
            {session?.user ? (
              <>
                <div className="flex items-center px-4 mb-3">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-12 w-12 rounded-full object-cover"
                      src={userProfileImage || session.user.image || '/default-profile.png'}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-semibold text-[#191919]">{session.user.name}</div>
                    <div className="text-sm text-[#666]">{session.user.email}</div>
                  </div>
                </div>
                <div className="px-4 space-y-1">
                  <Link href="/community/profile" className="block px-4 py-3 rounded-lg text-base font-medium text-[#191919] hover:bg-[#f3f6f8] transition-colors" onClick={() => setShowMobileMenu(false)}>View Profile</Link>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      signOut({ callbackUrl: '/community/signin' });
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-[#d11124] hover:bg-[#fef2f2] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4">
                <Link href="/community/signin" className="block w-full px-5 py-3 rounded-lg text-center text-base font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors" onClick={() => setShowMobileMenu(false)}>
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

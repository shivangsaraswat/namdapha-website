'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Info, Megaphone, AlertTriangle, CheckCircle, ExternalLink, Play, Pause } from 'lucide-react';
import { notificationService, type Notification } from '@/lib/notificationService';
import Image from 'next/image';

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const activeNotifications = await notificationService.getActiveNotifications();
      if (activeNotifications.length > 0) {
        setNotifications(activeNotifications);
        setIsVisible(true);
      }
    };

    fetchNotifications();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (notifications.length > 1 && isPlaying && isVisible) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === notifications.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [notifications.length, isPlaying, isVisible]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentNotification = notifications[currentIndex];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return { text: 'Announcement • Info', bg: 'bg-blue-100', text_color: 'text-blue-800', border: 'border-blue-200' };
      case 'announcement':
        return { text: 'Announcement', bg: 'bg-purple-100', text_color: 'text-purple-800', border: 'border-purple-200' };
      case 'warning':
        return { text: 'Announcement • Warning', bg: 'bg-amber-100', text_color: 'text-amber-800', border: 'border-amber-200' };
      case 'success':
        return { text: 'Announcement • Success', bg: 'bg-green-100', text_color: 'text-green-800', border: 'border-green-200' };
      default:
        return { text: 'Announcement', bg: 'bg-purple-100', text_color: 'text-purple-800', border: 'border-purple-200' };
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-600';
      case 'announcement':
        return 'text-purple-600';
      case 'warning':
        return 'text-amber-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsClosing(true);
    setTimeout(() => {
      if (currentIndex < notifications.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsClosing(false);
      } else {
        setIsVisible(false);
      }
    }, 200);
  };

  const handleDismissAll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleActionClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible || !currentNotification) return null;

  const typeBadge = getTypeBadge(currentNotification.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pt-28 sm:pt-20 md:pt-24 bg-black/30" onClick={handleDismissAll}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full mx-auto transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
        } ${currentNotification.imageUrl ? 'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl' : 'max-w-xs sm:max-w-sm lg:max-w-xl xl:max-w-2xl'} max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-6rem)]`}
      >
        {/* Main notification card */}
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with close button */}
          <div className="flex items-center justify-end p-3 pb-0 sm:p-4 sm:pb-0">
            <button
              onClick={handleClose}
              className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>

          {/* Content */}
          {currentNotification.imageUrl ? (
            <div className="flex flex-col sm:flex-row">
              {/* Image Section - Left side on desktop, top on mobile */}
              <div className="sm:w-2/5 sm:flex-shrink-0">
                <div className="relative h-28 sm:h-36 md:h-40">
                  <Image
                    src={currentNotification.imageUrl}
                    alt="Notification image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                </div>
              </div>
              
              {/* Text Content - Right side on desktop, bottom on mobile */}
              <div className="p-3 pt-2 sm:flex-1 sm:p-4">
                {/* Type badge */}
                <div className="mb-2">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${typeBadge.bg} ${typeBadge.text_color} ${typeBadge.border}`}>
                    <div className={getIconColor(currentNotification.type)}>
                      {getIcon(currentNotification.type)}
                    </div>
                    {typeBadge.text}
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {currentNotification.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                  {currentNotification.message}
                </p>

                {/* Action Button */}
                {currentNotification.actionButton && (
                  <div className="mb-2">
                    <button
                      onClick={() => handleActionClick(currentNotification.actionButton!.url)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentNotification.actionButton.style === 'primary'
                          ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {currentNotification.actionButton.text}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 pt-2 sm:p-4 sm:pt-3">
              {/* Type badge */}
              <div className="mb-2">
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${typeBadge.bg} ${typeBadge.text_color} ${typeBadge.border}`}>
                  <div className={getIconColor(currentNotification.type)}>
                    {getIcon(currentNotification.type)}
                  </div>
                  {typeBadge.text}
                </div>
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                {currentNotification.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                {currentNotification.message}
              </p>

              {/* Action Button */}
              {currentNotification.actionButton && (
                <div className="mb-2">
                  <button
                    onClick={() => handleActionClick(currentNotification.actionButton!.url)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      currentNotification.actionButton.style === 'primary'
                        ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {currentNotification.actionButton.text}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          {notifications.length > 1 && (
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title={isPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 text-gray-600" />
                  ) : (
                    <Play className="w-3 h-3 text-gray-600" />
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {currentIndex + 1} of {notifications.length}
                  </span>
                  <div className="flex gap-1">
                    {notifications.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-[#D4AF37]' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDismissAll}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium"
              >
                Dismiss all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
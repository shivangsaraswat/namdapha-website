"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import AnimatedGallery from "@/components/AnimatedGallery";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, mounted } = useTheme();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Animated Gallery Background */}
      <AnimatedGallery />
      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 md:top-6 md:right-6 p-3 rounded-full transition-all duration-200 z-50 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
        }`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Centered Card with Logo on Top Border */}
      <div className="relative w-full max-w-md z-20">
        {/* Logo positioned on top border */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
          <Image
            src="/namd-new-logo.png"
            alt="Namdapha Logo"
            width={120}
            height={120}
            className="rounded-full shadow-2xl"
          />
        </div>

        <div className={`pt-20 pb-8 px-6 md:px-10 rounded-2xl shadow-2xl backdrop-blur-xl ${
          isDarkMode ? 'bg-gray-800/95 border border-gray-700' : 'bg-white/95'
        }`}>
          {/* Title Section */}
          <div className="text-center space-y-1 mb-6">
            <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${
              isDarkMode ? 'bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent' : 'text-gray-900'
            }`}>
              Namdapha House
            </h1>
            <p className={`text-base md:text-lg font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              Admin Dashboard
            </p>
          </div>

          {/* Divider */}
          <div className={`border-t mb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
        
          {/* Sign In Section */}
          <div className="space-y-6">
            <div className="text-center">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Sign in to access your admin dashboard
              </p>
            </div>
          
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-medium rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          
            <div className={`text-center p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                🔒 Only authorized personnel can access this dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { isDarkMode, toggleDarkMode, mounted } = useTheme();

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Your access has been revoked. Please contact the Super Admin to restore your access.";
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "Your account access has been deactivated. Contact the Super Admin for assistance.";
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
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 via-white to-orange-50'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-200 z-10 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
        }`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className={`max-w-md w-full space-y-8 p-8 m-4 rounded-2xl shadow-xl ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className="text-center">
          <Image
            src="/namd-new-logo.png"
            alt="Namdapha Logo"
            width={80}
            height={80}
            className="mx-auto rounded-full shadow-lg"
          />
          
          <div className="mt-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDarkMode ? 'bg-red-900/20' : 'bg-red-100'
            }`}>
              <AlertCircle className={`w-8 h-8 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
            
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Authentication Error
            </h2>
          </div>
          
          <div className={`mt-6 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-red-900/10 border-red-800 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="text-sm font-medium">
              {getErrorMessage(error)}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
          >
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </Link>
          
          <div className={`text-center p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Contact the administrator if you believe this is an error
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
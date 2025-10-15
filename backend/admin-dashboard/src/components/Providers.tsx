"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Toaster } from "@/components/ui/sonner";

function ActivityWrapper({ children }: { children: React.ReactNode }) {
  useActivityTracker();
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>
          <ActivityWrapper>
            {children}
            <Toaster />
          </ActivityWrapper>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
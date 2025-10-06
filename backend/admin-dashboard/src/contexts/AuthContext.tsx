"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  const user = session?.user ? {
    id: session.user.email!,
    email: session.user.email!,
    name: session.user.name!,
    image: session.user.image,
    role: (session.user as any).role as UserRole,
    isActive: (session.user as any).isActive,
    createdAt: new Date(),
    lastLogin: new Date(),
  } : null;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // All authenticated users have access to all dashboard pages
    const allUserPermissions = ['dashboard', 'events', 'resource-hub', 'council', 'teams', 'certificates', 'link-tree', 'forms'];
    
    // Super admin has additional user management access
    if (user.role === 'super-admin') {
      return true; // Super admin has access to everything including user management
    }
    
    // All other users have access to all dashboard pages except user management
    return allUserPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: status === "loading",
      isAuthenticated: !!session,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
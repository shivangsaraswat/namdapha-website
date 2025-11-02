"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
}

export default function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (requiredPermission) {
      const userRole = (session.user as { role?: string })?.role;
      const permissions = {
        'super-admin': ['*'],
        'secretary': ['dashboard', 'events', 'resource-hub', 'council', 'teams', 'certificates'],
        'deputy-secretary': ['dashboard', 'events', 'resource-hub', 'teams'],
        'web-admin': ['dashboard', 'resource-hub', 'link-tree', 'forms'],
        'coordinator': ['dashboard', 'events', 'teams']
      };

      const userPermissions = permissions[userRole as keyof typeof permissions] || [];
      const hasPermission = userPermissions.includes('*') || userPermissions.includes(requiredPermission);

      if (!hasPermission) {
        router.push("/dashboard");
        return;
      }
    }
  }, [session, status, router, requiredPermission]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
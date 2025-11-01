"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { canDelete } from '@/lib/permissions';
import { DeletePermissions } from '@/lib/userService';

export function useDeletePermission(resource: keyof DeletePermissions) {
  const { user } = useAuth();
  const [canDeleteResource, setCanDeleteResource] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      if (!user?.email || !user?.role) {
        setCanDeleteResource(false);
        setIsLoading(false);
        return;
      }

      const hasPermission = await canDelete(user.email, user.role, resource);
      setCanDeleteResource(hasPermission);
      setIsLoading(false);
    }

    checkPermission();
  }, [user, resource]);

  return { canDelete: canDeleteResource, isLoading };
}

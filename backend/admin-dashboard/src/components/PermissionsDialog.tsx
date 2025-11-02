"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { DeletePermissions } from "@/lib/userService";
import { updateDeletePermissions } from "@/lib/permissions";
import { Wifi, WifiOff } from "lucide-react";

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userName: string;
  currentPermissions?: DeletePermissions;
}

const permissionOptions = [
  { key: 'council-leadership', label: 'Council - Leadership Members', category: 'Council' },
  { key: 'council-coordinators', label: 'Council - Regional Coordinators', category: 'Council' },
  { key: 'teams', label: 'Teams', category: 'Teams' },
  { key: 'events', label: 'Events', category: 'Events' },
  { key: 'certificates', label: 'Certificates', category: 'Certificates' },
  { key: 'link-tree-social', label: 'Link Tree - Social Links', category: 'Link Tree' },
  { key: 'link-tree-important', label: 'Link Tree - Important Links', category: 'Link Tree' },
  { key: 'resource-hub-pyqs', label: 'Resource Hub - PYQs', category: 'Resource Hub' },
  { key: 'resource-hub-contacts', label: 'Resource Hub - Important Contacts', category: 'Resource Hub' },
  { key: 'forms', label: 'Forms', category: 'Forms' },
];

export default function PermissionsDialog({ open, onOpenChange, userEmail, userName, currentPermissions }: PermissionsDialogProps) {
  const { isDarkMode } = useTheme();
  const [permissions, setPermissions] = useState<DeletePermissions>(currentPermissions || {});
  const [isOnline, setIsOnline] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setPermissions(currentPermissions || {});
  }, [currentPermissions]);

  const handleToggle = (key: keyof DeletePermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!isOnline) {
      const { toast } = await import('sonner');
      toast.error('No internet connection. Please check your connection and try again.');
      return;
    }
    
    setIsSaving(true);
    try {
      await updateDeletePermissions(userEmail, permissions);
      const { toast } = await import('sonner');
      toast.success('Permissions updated successfully');
      onOpenChange(false);
    } catch (error) {
      const { toast } = await import('sonner');
      toast.error(error instanceof Error ? error.message : 'Failed to update permissions. Check your internet connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
        <DialogHeader>
          <DialogTitle>Delete Permissions for {userName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Grant delete permissions for specific resources
            </p>
            <div className={`flex items-center gap-2 text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
          {Object.entries(
            permissionOptions.reduce((acc, option) => {
              if (!acc[option.category]) acc[option.category] = [];
              acc[option.category].push(option);
              return acc;
            }, {} as Record<string, typeof permissionOptions>)
          ).map(([category, options]) => (
            <div key={category} className="space-y-2">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {category}
              </h4>
              {options.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between pl-4">
                  <Label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</Label>
                  <button
                    onClick={() => handleToggle(key as keyof DeletePermissions)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      permissions[key as keyof DeletePermissions] ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      permissions[key as keyof DeletePermissions] ? 'translate-x-6 left-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1" disabled={!isOnline || isSaving}>
            {isSaving ? 'Saving...' : 'Save Permissions'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

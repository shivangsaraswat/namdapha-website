"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getMaintenanceStatus, setMaintenanceMode, MaintenanceMode } from "@/lib/maintenanceService";
import { toast } from "sonner";
import { Power, AlertTriangle, Clock, User, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function MaintenancePage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [maintenance, setMaintenance] = useState<MaintenanceMode>({
    isEnabled: false,
    message: 'We are currently performing scheduled maintenance. Please check back soon.',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaintenanceStatus();
  }, []);

  const loadMaintenanceStatus = async () => {
    try {
      const status = await getMaintenanceStatus();
      setMaintenance(status);
    } catch (error) {
      console.error('Error loading maintenance status:', error);
      toast.error('Failed to load maintenance status');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    if (!user?.email) return;

    setSaving(true);
    try {
      const newStatus = !maintenance.isEnabled;
      await setMaintenanceMode(
        newStatus,
        maintenance.message,
        maintenance.estimatedEndTime,
        user.email,
        maintenance.testInDevelopment
      );
      
      setMaintenance({ ...maintenance, isEnabled: newStatus });
      toast.success(
        newStatus 
          ? 'Maintenance mode enabled. Website is now offline.' 
          : 'Maintenance mode disabled. Website is now live.',
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast.error('Failed to toggle maintenance mode');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.email) return;

    setSaving(true);
    try {
      await setMaintenanceMode(
        maintenance.isEnabled,
        maintenance.message,
        maintenance.estimatedEndTime,
        user.email,
        maintenance.testInDevelopment
      );
      toast.success('Maintenance settings saved successfully');
    } catch (error) {
      console.error('Error saving maintenance settings:', error);
      toast.error('Failed to save maintenance settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard requiredPermission="*">
        <PageLayout title="Maintenance Mode" subtitle="Control website availability" activeItem="Maintenance">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </PageLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredPermission="*">
      <PageLayout title="Maintenance Mode" subtitle="Control website availability" activeItem="Maintenance">
        <div className="space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border flex items-center justify-between ${
            maintenance.isEnabled
              ? 'bg-red-50 border-red-200'
              : isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                maintenance.isEnabled ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Power className={`w-5 h-5 ${
                  maintenance.isEnabled ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-bold ${
                    maintenance.isEnabled ? 'text-red-900' : isDarkMode ? 'text-white' : 'text-green-900'
                  }`}>
                    Website is {maintenance.isEnabled ? 'OFFLINE' : 'ONLINE'}
                  </h3>
                  <Badge variant={maintenance.isEnabled ? 'destructive' : 'default'} className="text-xs">
                    {maintenance.isEnabled ? 'Maintenance Mode' : 'Live'}
                  </Badge>
                </div>
                <p className={`text-xs ${
                  maintenance.isEnabled ? 'text-red-700' : isDarkMode ? 'text-gray-400' : 'text-green-700'
                }`}>
                  {maintenance.isEnabled 
                    ? 'Visitors will see the maintenance page' 
                    : 'Website is accessible to all visitors'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleMaintenance}
              disabled={saving}
              variant={maintenance.isEnabled ? 'default' : 'destructive'}
              size="sm"
            >
              {saving ? 'Updating...' : maintenance.isEnabled ? 'Turn ON' : 'Turn OFF'}
            </Button>
          </div>

          {/* Warning */}
          <div className={`p-3 rounded-lg border flex items-start gap-2 ${
            isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
              Turning off the website will make it inaccessible to all visitors. Only use during scheduled maintenance.
            </p>
          </div>

          {/* Settings */}
          <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Maintenance Page Settings</CardTitle>
              <CardDescription className="text-xs">
                Customize the message shown to visitors during maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Maintenance Message</Label>
                <Textarea
                  value={maintenance.message}
                  onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                  rows={3}
                  className={`text-sm ${isDarkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                  placeholder="Enter the message to display to visitors..."
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This message will be displayed to visitors when maintenance mode is enabled.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Estimated End Time (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={maintenance.estimatedEndTime?.split('T')[0] || ''}
                    onChange={(e) => {
                      const time = maintenance.estimatedEndTime?.split('T')[1] || '12:00';
                      setMaintenance({ ...maintenance, estimatedEndTime: e.target.value ? `${e.target.value}T${time}` : '' });
                    }}
                    className={`text-sm flex-1 ${isDarkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                  />
                  <Input
                    type="time"
                    value={maintenance.estimatedEndTime?.split('T')[1] || ''}
                    onChange={(e) => {
                      const date = maintenance.estimatedEndTime?.split('T')[0] || new Date().toISOString().split('T')[0];
                      setMaintenance({ ...maintenance, estimatedEndTime: e.target.value ? `${date}T${e.target.value}` : '' });
                    }}
                    className={`text-sm w-32 ${isDarkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                  />
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Let visitors know when the website will be back online.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testInDevelopment"
                    checked={maintenance.testInDevelopment || false}
                    onChange={(e) => setMaintenance({ ...maintenance, testInDevelopment: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="testInDevelopment" className="text-sm cursor-pointer">
                    Enable in Development (Test on localhost)
                  </Label>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  When enabled, maintenance mode will also work on localhost for testing.
                </p>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          {maintenance.enabledBy && (
            <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Last Modified</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {maintenance.enabledBy}
                  </span>
                </div>
                {maintenance.enabledAt && (
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(maintenance.enabledAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </PageLayout>
    </AuthGuard>
  );
}

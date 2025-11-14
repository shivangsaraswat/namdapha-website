"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Users, Search, Ban, CheckCircle, XCircle, Trash2, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { communityService, CommunityUser } from "@/lib/communityService";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function CommunityUsersPage() {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    user: CommunityUser | null;
    action: 'suspend' | 'activate' | 'delete' | null;
  }>({ open: false, user: null, action: null });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await communityService.getAllUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionDialog.user || !actionDialog.action) return;

    try {
      const { user, action } = actionDialog;
      
      if (action === 'delete') {
        // TODO: Implement user deletion
        toast.error('User deletion not implemented yet');
      } else if (action === 'suspend') {
        await communityService.updateUserStatus(user.id!, 'suspended');
        toast.success(`${user.name} has been suspended`);
      } else if (action === 'activate') {
        await communityService.updateUserStatus(user.id!, 'active');
        toast.success(`${user.name} has been activated`);
      }

      setActionDialog({ open: false, user: null, action: null });
      loadUsers();
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to perform action');
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    deleted: users.filter(u => u.status === 'deleted').length
  };

  const getStatusColor = (status: CommunityUser['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-yellow-100 text-yellow-700';
      case 'deactivated': return 'bg-gray-100 text-gray-700';
      case 'deleted': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PageLayout title="Community Users" subtitle="Manage community members and their access" activeItem="Community Users" isLoading={loading}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Suspended</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.suspended}</p>
                </div>
                <Ban className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Deleted</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.deleted}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : ''}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className={`rounded-xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Community Members ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {searchQuery ? 'No users found' : 'No community members yet'}
                  </p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          @{user.username} • {user.email}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.stats.posts} posts
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Last active {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {user.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActionDialog({ open: true, user, action: 'suspend' })}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActionDialog({ open: true, user, action: 'activate' })}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActionDialog({ open: true, user, action: 'delete' })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, user: null, action: null })}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                actionDialog.action === 'delete' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  actionDialog.action === 'delete' ? 'text-red-600' : 'text-yellow-600'
                }`} />
              </div>
              <div>
                <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {actionDialog.action === 'delete' ? 'Delete User' :
                   actionDialog.action === 'suspend' ? 'Suspend User' : 'Activate User'}
                </DialogTitle>
                <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  This action will affect the user's access
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className={`py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {actionDialog.action === 'delete' && (
              <p>Are you sure you want to permanently delete <span className="font-semibold">{actionDialog.user?.name}</span>? This action cannot be undone.</p>
            )}
            {actionDialog.action === 'suspend' && (
              <p>Are you sure you want to suspend <span className="font-semibold">{actionDialog.user?.name}</span>? They will not be able to access the community.</p>
            )}
            {actionDialog.action === 'activate' && (
              <p>Are you sure you want to activate <span className="font-semibold">{actionDialog.user?.name}</span>? They will regain access to the community.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, user: null, action: null })}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className={actionDialog.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

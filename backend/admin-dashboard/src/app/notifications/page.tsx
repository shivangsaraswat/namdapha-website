'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Bell, Megaphone, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { notificationService, type Notification, type CreateNotificationData } from '@/lib/notificationService';
import PageLayout from '@/components/PageLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';
import { uploadImage } from '@/lib/cloudinary';
import Image from 'next/image';

export default function NotificationsPage() {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<CreateNotificationData>({
    title: '',
    message: '',
    type: 'announcement',
    priority: 1,
  });
  const [showActionButton, setShowActionButton] = useState(false);
  const [actionButtonData, setActionButtonData] = useState({
    text: '',
    url: '',
    style: 'primary' as 'primary' | 'secondary'
  });
  const [showImage, setShowImage] = useState(false);
  const [imageData, setImageData] = useState({
    url: '',
    uploadMethod: 'upload' as 'upload' | 'url'
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
    } catch {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    if (showActionButton && (!actionButtonData.text.trim() || !actionButtonData.url.trim())) {
      toast.error('Action button text and URL are required when enabled');
      return;
    }

    if (showImage && !imageData.url.trim()) {
      toast.error('Image URL is required when image is enabled');
      return;
    }

    try {
      // Build notification data, only including optional fields if they have values
      const notificationData: CreateNotificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
      };

      // Add optional fields only if they have values
      if (formData.expiresAt) {
        notificationData.expiresAt = formData.expiresAt;
      }
      if (showActionButton && actionButtonData.text && actionButtonData.url) {
        notificationData.actionButton = actionButtonData;
      }
      if (showImage && imageData.url) {
        notificationData.imageUrl = imageData.url;
      }

      if (editingNotification) {
        await notificationService.updateNotification(editingNotification.id, notificationData);
        toast.success('Notification updated successfully');
      } else {
        await notificationService.createNotification(notificationData);
        toast.success('Notification created successfully');
      }

      setIsDialogOpen(false);
      setEditingNotification(null);
      setFormData({ title: '', message: '', type: 'announcement', priority: 1 });
      setShowActionButton(false);
      setActionButtonData({ text: '', url: '', style: 'primary' });
      setShowImage(false);
      setImageData({ url: '', uploadMethod: 'upload' });
      fetchNotifications();
    } catch {
      toast.error(editingNotification ? 'Failed to update notification' : 'Failed to create notification');
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      expiresAt: notification.expiresAt,
    });
    if (notification.actionButton) {
      setShowActionButton(true);
      setActionButtonData({
        text: notification.actionButton.text,
        url: notification.actionButton.url,
        style: notification.actionButton.style
      });
    } else {
      setShowActionButton(false);
      setActionButtonData({ text: '', url: '', style: 'primary' });
    }
    if (notification.imageUrl) {
      setShowImage(true);
      setImageData({ url: notification.imageUrl, uploadMethod: 'url' });
    } else {
      setShowImage(false);
      setImageData({ url: '', uploadMethod: 'upload' });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      await notificationService.deleteNotification(id);
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await notificationService.toggleNotificationStatus(id, !currentStatus);
      toast.success(`Notification ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchNotifications();
    } catch {
      toast.error('Failed to update notification status');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be less than 8MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(file, 'notifications');
      setImageData({ ...imageData, url: result.url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-purple-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeBadgeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'announcement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout title="Notifications" activeItem="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage website notifications and announcements
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingNotification(null);
                  setFormData({ title: '', message: '', type: 'announcement', priority: 1 });
                }}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>

            <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle>
                  {editingNotification ? 'Edit Notification' : 'Create New Notification'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter notification title"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter notification message"
                    rows={3}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'info' | 'announcement' | 'warning' | 'success') => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.priority.toString()}
                      onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Low</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt ? new Date(formData.expiresAt.getTime() - formData.expiresAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      expiresAt: e.target.value ? new Date(e.target.value) : undefined
                    })}
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                {/* Image Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showImage"
                      checked={showImage}
                      onChange={(e) => setShowImage(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="showImage">Add Image Media</Label>
                  </div>

                  {showImage && (
                    <div className="space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-600">
                      <div className="space-y-2">
                        <Label>Upload Method</Label>
                        <Select
                          value={imageData.uploadMethod}
                          onValueChange={(value: 'upload' | 'url') => setImageData({ uploadMethod: value, url: '' })}
                        >
                          <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upload">Upload Image</SelectItem>
                            <SelectItem value="url">Image URL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {imageData.uploadMethod === 'upload' ? (
                        <div className="space-y-2">
                          <Label htmlFor="imageFile">Image File <span className="text-red-500">*</span></Label>
                          <Input
                            id="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                            disabled={uploading}
                            className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                          />
                          <p className="text-xs text-gray-500">Maximum file size: 8MB. Supported formats: JPG, PNG, GIF, WebP</p>
                          {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl">Image URL <span className="text-red-500">*</span></Label>
                          <Input
                            id="imageUrl"
                            value={imageData.url || ''}
                            onChange={(e) => setImageData({ ...imageData, url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </div>
                      )}

                      {imageData.url && imageData.url.trim() && (
                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <div className="relative w-full h-32 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <Image
                              src={imageData.url}
                              alt="Preview"
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showActionButton"
                      checked={showActionButton}
                      onChange={(e) => setShowActionButton(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="showActionButton">Add Action Button</Label>
                  </div>

                  {showActionButton && (
                    <div className="space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-600">
                      <div className="space-y-2">
                        <Label htmlFor="buttonText">Button Text <span className="text-red-500">*</span></Label>
                        <Input
                          id="buttonText"
                          value={actionButtonData.text}
                          onChange={(e) => setActionButtonData({ ...actionButtonData, text: e.target.value })}
                          placeholder="e.g., Learn More, Register Now"
                          className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buttonUrl">Button URL <span className="text-red-500">*</span></Label>
                        <Input
                          id="buttonUrl"
                          value={actionButtonData.url}
                          onChange={(e) => setActionButtonData({ ...actionButtonData, url: e.target.value })}
                          placeholder="https://example.com or /events"
                          className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="buttonStyle">Button Style</Label>
                        <Select
                          value={actionButtonData.style}
                          onValueChange={(value: 'primary' | 'secondary') => setActionButtonData({ ...actionButtonData, style: value })}
                        >
                          <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary (Golden)</SelectItem>
                            <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>
                  {editingNotification ? 'Update' : 'Create'} Notification
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notifications List */}
        <div className="grid gap-4">
          {notifications.length === 0 ? (
            <Card className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No notifications yet
                </h3>
                <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Create your first notification to engage with website visitors.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(notification.type)}
                      <div>
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeBadgeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          <Badge variant="outline">
                            Priority: {notification.priority === 1 ? 'Low' : notification.priority === 2 ? 'Medium' : 'High'}
                          </Badge>
                          <Badge variant={notification.isActive ? 'default' : 'secondary'}>
                            {notification.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(notification.id, notification.isActive)}
                      >
                        {notification.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>

                  <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>
                      Created: {notification.createdAt.toLocaleDateString()}
                    </span>
                    {notification.expiresAt && (
                      <span>
                        Expires: {notification.expiresAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
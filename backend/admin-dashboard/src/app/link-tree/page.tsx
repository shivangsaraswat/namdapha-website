"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link as LinkIcon, ExternalLink, Plus, Edit, Trash2, Eye, EyeOff, BarChart3 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { linkService, Link } from "@/lib/linkService";
import { toast } from "sonner";
import { useDeletePermission } from "@/hooks/useDeletePermission";

export default function LinkTree() {
  const { isDarkMode } = useTheme();
  const { canDelete: canDeleteSocial } = useDeletePermission('link-tree-social');
  const { canDelete: canDeleteImportant } = useDeletePermission('link-tree-important');
  const [links, setLinks] = useState<Link[]>([]);
  const [, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Links", value: "0", change: "+0" },
    { label: "Total Clicks", value: "0", change: "+0%" },
    { label: "Active Links", value: "0", change: "+0" },
    { label: "Social Links", value: "0", change: "+0" }
  ]);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [visibilityConfirm, setVisibilityConfirm] = useState<Link | null>(null);
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    description: '',
    url: ''
  });
  const [socialFormData, setSocialFormData] = useState({
    url: '',
    platform: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const allLinks = await linkService.getAllLinks();
      setLinks(allLinks);
      
      const totalLinks = allLinks.length;
      const totalClicks = allLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);
      const activeLinks = allLinks.filter(l => l.status === 'active').length;
      const socialLinks = allLinks.filter(l => l.type === 'social').length;
      
      setStats([
        { label: "Total Links", value: totalLinks.toString(), change: "+0" },
        { label: "Total Clicks", value: totalClicks.toString(), change: "+0%" },
        { label: "Active Links", value: activeLinks.toString(), change: "+0" },
        { label: "Social Links", value: socialLinks.toString(), change: "+0" }
      ]);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLinkClick = () => {
    setEditingLink(null);
    setLinkFormData({ title: '', description: '', url: '' });
    setIsLinkDialogOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    if (link.type === 'social') {
      setSocialFormData({ url: link.url, platform: link.platform || '' });
      setIsSocialDialogOpen(true);
    } else {
      setLinkFormData({ title: link.title, description: link.category, url: link.url });
      setIsLinkDialogOpen(true);
    }
  };

  const handleDeleteLink = async (linkId: string, linkType: 'social' | 'important') => {
    const hasPermission = linkType === 'social' ? canDeleteSocial : canDeleteImportant;
    
    if (!hasPermission) {
      toast.error(
        `You don't have permission to delete ${linkType} links. Ask Super Admin to grant permission, or you can edit the link and change visibility.`,
        { duration: 7000, style: { maxWidth: '500px' } }
      );
      setDeleteConfirm(null);
      return;
    }
    
    try {
      await linkService.deleteLink(linkId);
      toast.success('Link deleted successfully');
      setDeleteConfirm(null);
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const handleToggleVisibility = async (link: Link) => {
    try {
      const newStatus = link.status === 'active' ? 'inactive' : 'active';
      await linkService.updateLink(link.id!, { status: newStatus });
      toast.success(`Link ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      setVisibilityConfirm(null);
      await fetchLinks();
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link');
    }
  };

  const handleAddSocialClick = () => {
    setSocialFormData({ url: '', platform: '' });
    setIsSocialDialogOpen(true);
  };

  const handleSaveLink = async () => {
    if (!linkFormData.title || !linkFormData.url || !linkFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingLink) {
        await linkService.updateLink(editingLink.id!, {
          title: linkFormData.title,
          url: linkFormData.url,
          category: linkFormData.description,
          updatedAt: new Date()
        });
        toast.success('Link updated successfully');
      } else {
        const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.order)) : 0;
        await linkService.addLink({
          title: linkFormData.title,
          url: linkFormData.url,
          category: linkFormData.description,
          type: 'important',
          status: 'active',
          order: maxOrder + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Link added successfully');
      }
      setIsLinkDialogOpen(false);
      setLinkFormData({ title: '', description: '', url: '' });
      setEditingLink(null);
      await fetchLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error('Failed to save link');
    }
  };

  const handleSaveSocial = async () => {
    if (!socialFormData.url || !socialFormData.platform) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingLink) {
        await linkService.updateLink(editingLink.id!, {
          url: socialFormData.url,
          platform: socialFormData.platform,
          title: socialFormData.platform,
          updatedAt: new Date()
        });
        toast.success('Social link updated successfully');
      } else {
        const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.order)) : 0;
        await linkService.addLink({
          title: socialFormData.platform,
          url: socialFormData.url,
          category: 'Social Media',
          type: 'social',
          platform: socialFormData.platform,
          status: 'active',
          order: maxOrder + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Social link added successfully');
      }
      setIsSocialDialogOpen(false);
      setSocialFormData({ url: '', platform: '' });
      setEditingLink(null);
      await fetchLinks();
    } catch (error) {
      console.error('Error saving social link:', error);
      toast.error('Failed to save social link');
    }
  };

  return (
    <PageLayout title="Link Tree Management" subtitle="Manage your link tree and track performance" activeItem="Link Tree">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddSocialClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Social Media
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleAddLinkClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stat.value}</p>
                  </div>
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Media Links Section */}
        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.filter(link => link.type === 'social').length === 0 ? (
                <div className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No social media links yet</p>
                </div>
              ) : (
                links.filter(link => link.type === 'social').map((link) => {
                  const SocialIcon = () => {
                    const iconClass = `w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;
                    switch(link.platform) {
                      case 'instagram':
                        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
                      case 'youtube':
                        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
                      case 'whatsapp':
                        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>;
                      case 'linkedin':
                        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
                      case 'twitter':
                        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
                      case 'facebook':
                        return <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
                      default:
                        return <LinkIcon className={iconClass} />;
                    }
                  };
                  
                  return (
                    <div key={link.id} className={`flex items-center justify-between p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <SocialIcon />
                        <div>
                          <h4 className={`font-medium capitalize ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{link.platform}</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge className={`${
                              link.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {link.status}
                            </Badge>
                            <span className={`${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>{link.clicks || 0} clicks</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setVisibilityConfirm(link)} title={link.status === 'active' ? 'Hide' : 'Show'}>
                          {link.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open(link.url, '_blank')} title="View">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditLink(link)} title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(link.id!)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Links Section */}
        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Important Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.filter(link => link.type === 'important').length === 0 ? (
                <div className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No important links yet</p>
                </div>
              ) : (
                links.filter(link => link.type === 'important').map((link) => (
                  <div key={link.id} className={`flex items-center justify-between p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <LinkIcon className={`w-8 h-8 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{link.title}</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className={`${
                            link.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {link.status}
                          </Badge>
                          <span className={`${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{link.clicks || 0} clicks</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setVisibilityConfirm(link)} title={link.status === 'active' ? 'Hide' : 'Show'}>
                        {link.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.open(link.url, '_blank')} title="View">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditLink(link)} title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(link.id!)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Eye className="w-6 h-6 mb-2" />
                Preview Link Tree
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ExternalLink className="w-6 h-6 mb-2" />
                Share Link Tree
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Important Link Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {editingLink ? 'Edit' : 'Add'} Important Link
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Link Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter link title"
                  value={linkFormData.title}
                  onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter one line description"
                  value={linkFormData.description}
                  onChange={(e) => setLinkFormData({ ...linkFormData, description: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Link URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={linkFormData.url}
                  onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={handleSaveLink} className="bg-purple-600 hover:bg-purple-700 text-white">
                {editingLink ? 'Update' : 'Add'} Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Social Media Dialog */}
        <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {editingLink ? 'Edit' : 'Add'} Social Media Link
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Platform <span className="text-red-500">*</span>
                </Label>
                <Select value={socialFormData.platform} onValueChange={(value) => setSocialFormData({ ...socialFormData, platform: value })}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-url" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Profile URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="social-url"
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={socialFormData.url}
                  onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSocialDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={handleSaveSocial} className="bg-blue-600 hover:bg-blue-700 text-white">
                {editingLink ? 'Update' : 'Add'} Social Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Delete Link
              </DialogTitle>
            </DialogHeader>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Are you sure you want to delete this link? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (deleteConfirm) {
                  const link = links.find(l => l.id === deleteConfirm);
                  if (link) handleDeleteLink(deleteConfirm, link.type as 'social' | 'important');
                }
              }} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Visibility Confirmation Dialog */}
        <Dialog open={!!visibilityConfirm} onOpenChange={() => setVisibilityConfirm(null)}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {visibilityConfirm?.status === 'active' ? 'Hide' : 'Show'} Link
              </DialogTitle>
            </DialogHeader>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Are you sure you want to {visibilityConfirm?.status === 'active' ? 'hide' : 'show'} this link?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setVisibilityConfirm(null)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={() => visibilityConfirm && handleToggleVisibility(visibilityConfirm)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
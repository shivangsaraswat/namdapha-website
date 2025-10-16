"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { resourceService, Resource } from "@/lib/resourceService";
import { toast } from "sonner";
import ContactManagement from "./ContactManagement";
import PYQManagement from "./PYQManagement";

export default function CategoryClient({ categorySlug }: { categorySlug: string }) {
  const { isDarkMode } = useTheme();
  const categoryName = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const isContactsPage = categoryName === 'Important Contacts';
  const isPYQsPage = categoryName === 'Pyqs';
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    description: '',
    externalLink: ''
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const allResources = await resourceService.getAllResources();
      const filtered = allResources.filter(r => r.category === categoryName);
      setResources(filtered);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isContactsPage && !isPYQsPage) {
      fetchResources();
    }
  }, [categoryName, isContactsPage, isPYQsPage]);

  const handleDeleteClick = (resource: Resource) => {
    setResourceToDelete(resource);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete?.id) return;
    
    try {
      const resourceTitle = resourceToDelete.title;
      await resourceService.deleteResource(resourceToDelete.id);
      setIsDeleteDialogOpen(false);
      setResourceToDelete(null);
      await fetchResources();
      toast.success(`${resourceTitle} deleted successfully`);
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleToggleResourceStatus = async (resource: Resource) => {
    try {
      const newStatus = resource.status === 'published' ? 'draft' : 'published';
      await resourceService.updateResource(resource.id!, { status: newStatus });
      await fetchResources();
      toast.success(newStatus === 'published' ? `${resource.title} is now visible` : `${resource.title} is now hidden`);
    } catch (error) {
      console.error('Error toggling resource status:', error);
      toast.error('Failed to update resource status');
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setResourceFormData({
      title: resource.title,
      description: resource.description,
      externalLink: resource.fileUrl || ''
    });
    setIsResourceDialogOpen(true);
  };

  const handleAddResourceClick = () => {
    setEditingResource(null);
    setResourceFormData({ title: '', description: '', externalLink: '' });
    setIsResourceDialogOpen(true);
  };

  const handleSaveResource = async () => {
    if (!resourceFormData.title || !resourceFormData.description || !resourceFormData.externalLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingResource?.id) {
        await resourceService.updateResource(editingResource.id, {
          title: resourceFormData.title,
          description: resourceFormData.description,
          fileUrl: resourceFormData.externalLink,
          updatedAt: new Date()
        });
        toast.success(`${resourceFormData.title} updated successfully`);
      } else {
        await resourceService.addResource({
          title: resourceFormData.title,
          description: resourceFormData.description,
          category: categoryName,
          fileUrl: resourceFormData.externalLink,
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success(`${resourceFormData.title} added successfully`);
      }
      
      setResourceFormData({ title: '', description: '', externalLink: '' });
      setEditingResource(null);
      setIsResourceDialogOpen(false);
      await fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
  };

  if (isContactsPage) {
    return (
      <PageLayout title="Important Contacts Management" subtitle="Manage house leadership and other contacts" activeItem="Resource Hub">
        <ContactManagement />
      </PageLayout>
    );
  }

  if (isPYQsPage) {
    return (
      <PageLayout title="PYQs Management" subtitle="Manage previous year question papers" activeItem="Resource Hub">
        <PYQManagement />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${categoryName} Management`} subtitle={`Manage ${categoryName.toLowerCase()} resources`} activeItem="Resource Hub">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddResourceClick}>
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>

        <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {categoryName} Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No resources found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{resource.description}</span>
                          <Badge className={`${resource.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {resource.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className={resource.status === 'published' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} title={resource.status === 'published' ? 'Hide' : 'Show'} onClick={() => handleToggleResourceStatus(resource)}>
                        {resource.status === 'published' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700" title="Edit" onClick={() => handleEditResource(resource)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" title="Delete" onClick={() => handleDeleteClick(resource)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isResourceDialogOpen} onOpenChange={(open) => {
        setIsResourceDialogOpen(open);
        if (!open) {
          setEditingResource(null);
          setResourceFormData({ title: '', description: '', externalLink: '' });
        }
      }}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingResource ? 'Edit Resource' : `Add Resource to ${categoryName}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input id="title" placeholder="Enter resource title" value={resourceFormData.title} onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })} className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea id="description" placeholder="Enter description" value={resourceFormData.description} onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })} className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalLink" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                External Link <span className="text-red-500">*</span>
              </Label>
              <Input id="externalLink" type="url" placeholder="https://example.com" value={resourceFormData.externalLink} onChange={(e) => setResourceFormData({ ...resourceFormData, externalLink: e.target.value })} className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>Cancel</Button>
            <Button onClick={handleSaveResource} className="bg-green-600 hover:bg-green-700 text-white">{editingResource ? 'Update Resource' : 'Add Resource'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Delete Resource</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Are you sure you want to delete <span className="font-semibold">{resourceToDelete?.title}</span>? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

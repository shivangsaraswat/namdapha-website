"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, User, ArrowLeft, Crown, Target, ClipboardList, Drama, Briefcase, Phone, RefreshCw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { contactService, Contact } from "@/lib/contactService";
import { toast } from "sonner";
import Image from "next/image";
import { uploadImage } from "@/lib/cloudinary";
import { useDeletePermission } from "@/hooks/useDeletePermission";

const categories = [
  { id: 'leadership', label: 'House Leadership', Icon: Crown },
  { id: 'pods', label: 'PODs', Icon: Target },
  { id: 'sec', label: 'Student Executive Committee', Icon: ClipboardList },
  { id: 'paradox', label: 'Paradox', Icon: Drama },
  { id: 'placement', label: 'Placement', Icon: Briefcase },
  { id: 'others', label: 'Others', Icon: Phone }
];

export default function ContactManagement() {
  const { isDarkMode } = useTheme();
  const { canDelete: canDeleteContacts } = useDeletePermission('resource-hub-contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [visibilityConfirm, setVisibilityConfirm] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    photoUrl: '',
    description: '',
    category: 'leadership' as Contact['category']
  });
  const [uploading, setUploading] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      const mappedData = data.map(contact => ({
        ...contact,
        category: ((contact as { category?: string; type?: string }).category || (contact as { category?: string; type?: string }).type || 'leadership') as Contact['category']
      }));
      setContacts(mappedData);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (category: Contact['category']) => {
    setEditingContact(null);
    setFormData({ name: '', role: '', email: '', photoUrl: '', description: '', category });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file, 'contacts');
      setFormData({ ...formData, photoUrl: result.url });
      toast.success(result.message || 'Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      photoUrl: contact.photoUrl || '',
      description: contact.description || '',
      category: contact.category
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.role || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingContact) {
        await contactService.updateContact(editingContact.id!, {
          ...formData,
          updatedAt: new Date()
        });
        toast.success('Contact updated successfully');
      } else {
        const maxOrder = contacts.length > 0 ? Math.max(...contacts.map(c => c.order)) : 0;
        await contactService.addContact({
          ...formData,
          status: 'active',
          order: maxOrder + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Contact added successfully');
      }
      setIsDialogOpen(false);
      setFormData({ name: '', role: '', email: '', photoUrl: '', description: '', category: 'leadership' });
      setEditingContact(null);
      await fetchContacts();
    } catch {
      toast.error('Failed to save contact');
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteContacts) {
      toast.error(
        "You don't have permission to delete contacts. Ask Super Admin to grant permission, or you can edit details and change visibility.",
        { duration: 7000, style: { maxWidth: '500px' } }
      );
      setDeleteConfirm(null);
      return;
    }
    
    try {
      await contactService.deleteContact(id);
      toast.success('Contact deleted successfully');
      setDeleteConfirm(null);
      await fetchContacts();
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  const handleToggleVisibility = async (contact: Contact) => {
    try {
      const newStatus = contact.status === 'active' ? 'inactive' : 'active';
      await contactService.updateContact(contact.id!, { status: newStatus });
      toast.success(`Contact ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      setVisibilityConfirm(null);
      await fetchContacts();
    } catch {
      toast.error('Failed to update contact');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/resource-hub'}
          className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resource Hub
        </Button>
        <Button
          onClick={async () => {
            setClearingCache(true);
            try {
              await fetch('/api/cache/clear', { method: 'POST' });
              if (typeof window !== 'undefined') {
                Object.keys(localStorage)
                  .filter(k => k.startsWith('namdapha_cache_'))
                  .forEach(k => localStorage.removeItem(k));
                localStorage.setItem('cache_cleared_timestamp', Date.now().toString());
              }
              toast.success('Cache cleared successfully. Frontend will update on next visit.');
            } catch {
              toast.error('Failed to clear cache');
            } finally {
              setClearingCache(false);
            }
          }}
          disabled={clearingCache}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${clearingCache ? 'animate-spin' : ''}`} />
          {clearingCache ? 'Clearing...' : 'Clear Cache'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        categories.map((cat) => {
          const categoryContacts = contacts.filter(c => {
            const contactCat = c.category || (c as { type?: string }).type;
            return contactCat === cat.id;
          });
          return (
            <Card key={cat.id} className={`rounded-2xl shadow-sm border-0 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <cat.Icon className="w-5 h-5" />
                    {cat.label} ({categoryContacts.length})
                  </CardTitle>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white" 
                    onClick={() => handleAddClick(cat.id as Contact['category'])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryContacts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No contacts in this category yet</p>
                    </div>
                  ) : (
                    categoryContacts.map((contact) => (
                      <div key={contact.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-gray-400 overflow-hidden flex-shrink-0">
                            {contact.photoUrl ? (
                              <Image src={contact.photoUrl} alt={contact.name} width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-400">
                                <User className="w-6 h-6 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {contact.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {contact.role}
                              </span>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {contact.email}
                              </span>
                              <Badge className={`${contact.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {contact.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setVisibilityConfirm(contact)} title={contact.status === 'active' ? 'Hide' : 'Show'}>
                            {contact.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(contact)} title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(contact.id!)} title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingContact ? 'Edit' : 'Add'} Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Contact['category'] })}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className={isDarkMode ? 'hover:bg-gray-600 focus:bg-gray-600' : ''}>
                      <div className="flex items-center gap-2">
                        <cat.Icon className="w-4 h-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Role/Designation <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter role or designation"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Description</Label>
              <Input
                placeholder="Short description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Profile Photo</Label>
              <div className="flex items-center gap-4">
                {formData.photoUrl && (
                  <Image
                    src={formData.photoUrl}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploading}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>
              {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
              {editingContact ? 'Update' : 'Add'} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Delete Contact</DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to delete this contact? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visibility Confirmation */}
      <Dialog open={!!visibilityConfirm} onOpenChange={() => setVisibilityConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {visibilityConfirm?.status === 'active' ? 'Hide' : 'Show'} Contact
            </DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to {visibilityConfirm?.status === 'active' ? 'hide' : 'show'} this contact?
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
    </>
  );
}

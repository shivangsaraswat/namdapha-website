"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { contactService, Contact } from "@/lib/contactService";
import { toast } from "sonner";
import Image from "next/image";
import { uploadImage } from "@/lib/cloudinary";

export default function ContactManagement() {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [, setLoading] = useState(true);
  const [isLeadershipDialogOpen, setIsLeadershipDialogOpen] = useState(false);
  const [isOtherDialogOpen, setIsOtherDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [visibilityConfirm, setVisibilityConfirm] = useState<Contact | null>(null);
  const [leadershipFormData, setLeadershipFormData] = useState({
    name: '',
    role: '',
    email: '',
    photoUrl: '',
    description: ''
  });
  const [otherFormData, setOtherFormData] = useState({
    name: '',
    role: '',
    email: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeadershipClick = () => {
    setEditingContact(null);
    setLeadershipFormData({ name: '', role: '', email: '', photoUrl: '', description: '' });
    setIsLeadershipDialogOpen(true);
  };

  const handleAddOtherClick = () => {
    setEditingContact(null);
    setOtherFormData({ name: '', role: '', email: '' });
    setIsOtherDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file, 'contacts');
      setLeadershipFormData({ ...leadershipFormData, photoUrl: result.url });
      toast.success(result.message || 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    if (contact.type === 'leadership') {
      setLeadershipFormData({
        name: contact.name,
        role: contact.role,
        email: contact.email,
        photoUrl: contact.photoUrl || '',
        description: contact.description || ''
      });
      setIsLeadershipDialogOpen(true);
    } else {
      setOtherFormData({
        name: contact.name,
        role: contact.role,
        email: contact.email
      });
      setIsOtherDialogOpen(true);
    }
  };

  const handleSaveLeadership = async () => {
    if (!leadershipFormData.name || !leadershipFormData.role || !leadershipFormData.email || !leadershipFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingContact) {
        await contactService.updateContact(editingContact.id!, {
          ...leadershipFormData,
          type: 'leadership',
          updatedAt: new Date()
        });
        toast.success('Leadership contact updated successfully');
      } else {
        const maxOrder = contacts.length > 0 ? Math.max(...contacts.map(c => c.order)) : 0;
        await contactService.addContact({
          ...leadershipFormData,
          type: 'leadership',
          status: 'active',
          order: maxOrder + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Leadership contact added successfully');
      }
      setIsLeadershipDialogOpen(false);
      setLeadershipFormData({ name: '', role: '', email: '', photoUrl: '', description: '' });
      setEditingContact(null);
      await fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    }
  };

  const handleSaveOther = async () => {
    if (!otherFormData.name || !otherFormData.role || !otherFormData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingContact) {
        await contactService.updateContact(editingContact.id!, {
          ...otherFormData,
          type: 'other',
          updatedAt: new Date()
        });
        toast.success('Contact updated successfully');
      } else {
        const maxOrder = contacts.length > 0 ? Math.max(...contacts.map(c => c.order)) : 0;
        await contactService.addContact({
          ...otherFormData,
          type: 'other',
          status: 'active',
          order: maxOrder + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Contact added successfully');
      }
      setIsOtherDialogOpen(false);
      setOtherFormData({ name: '', role: '', email: '' });
      setEditingContact(null);
      await fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactService.deleteContact(id);
      toast.success('Contact deleted successfully');
      setDeleteConfirm(null);
      await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
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
    } catch (error) {
      console.error('Error updating contact:', error);
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
      </div>

      {/* House Leadership Section */}
      <Card className={`rounded-2xl shadow-sm border-0 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              House Leadership ({contacts.filter(c => c.type === 'leadership').length})
            </CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddLeadershipClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add House Leadership
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.filter(c => c.type === 'leadership').length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No leadership contacts yet</p>
              </div>
            ) : (
              contacts.filter(c => c.type === 'leadership').map((contact) => (
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

      {/* Other Contacts Section */}
      <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Other Contacts ({contacts.filter(c => c.type === 'other').length})
            </CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleAddOtherClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Other Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.filter(c => c.type === 'other').length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No other contacts yet</p>
              </div>
            ) : (
              contacts.filter(c => c.type === 'other').map((contact) => (
                <div key={contact.id} className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
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

      {/* Leadership Dialog */}
      <Dialog open={isLeadershipDialogOpen} onOpenChange={setIsLeadershipDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingContact ? 'Edit' : 'Add'} House Leadership Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter name"
                value={leadershipFormData.name}
                onChange={(e) => setLeadershipFormData({ ...leadershipFormData, name: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={leadershipFormData.role} onValueChange={(value) => setLeadershipFormData({ ...leadershipFormData, role: value })}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                  <SelectItem value="Secretary" className={isDarkMode ? 'hover:bg-gray-600 focus:bg-gray-600' : ''}>Secretary</SelectItem>
                  <SelectItem value="Deputy Secretary" className={isDarkMode ? 'hover:bg-gray-600 focus:bg-gray-600' : ''}>Deputy Secretary</SelectItem>
                  <SelectItem value="Web-Admin" className={isDarkMode ? 'hover:bg-gray-600 focus:bg-gray-600' : ''}>Web-Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Short one-line description"
                value={leadershipFormData.description}
                onChange={(e) => setLeadershipFormData({ ...leadershipFormData, description: e.target.value })}
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
                value={leadershipFormData.email}
                onChange={(e) => setLeadershipFormData({ ...leadershipFormData, email: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Profile Photo</Label>
              <div className="flex items-center gap-4">
                {leadershipFormData.photoUrl && (
                  <Image
                    src={leadershipFormData.photoUrl}
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
            <Button variant="outline" onClick={() => setIsLeadershipDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={handleSaveLeadership} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingContact ? 'Update' : 'Add'} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Other Contact Dialog */}
      <Dialog open={isOtherDialogOpen} onOpenChange={setIsOtherDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingContact ? 'Edit' : 'Add'} Other Contact
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter name"
                value={otherFormData.name}
                onChange={(e) => setOtherFormData({ ...otherFormData, name: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter role/designation"
                value={otherFormData.role}
                onChange={(e) => setOtherFormData({ ...otherFormData, role: e.target.value })}
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
                value={otherFormData.email}
                onChange={(e) => setOtherFormData({ ...otherFormData, email: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOtherDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={handleSaveOther} className="bg-purple-600 hover:bg-purple-700 text-white">
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

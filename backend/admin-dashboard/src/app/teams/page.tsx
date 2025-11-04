"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Eye, EyeOff, Trash2, Plus, Edit, Loader2, AlertTriangle, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { saveTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember, reorderTeamMembers, TeamMember } from "@/lib/teamService";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from "sonner";

const categories = [
  { value: "webops", label: "Web-Ops" },
  { value: "multimedia", label: "Multimedia" },
  { value: "outreach", label: "Out Reach" }
];

export default function Teams() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';
  
  const [webops, setWebops] = useState<TeamMember[]>([]);
  const [multimedia, setMultimedia] = useState<TeamMember[]>([]);
  const [outreach, setOutreach] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, member: TeamMember | null}>({open: false, member: null});
  
  const [form, setForm] = useState({
    name: "",
    position: "",
    category: "" as 'webops' | 'multimedia' | 'outreach' | '',
    poster: null as File | null
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const members = await getTeamMembers();
      setWebops(members.filter(m => m.category === 'webops').sort((a, b) => a.order - b.order));
      setMultimedia(members.filter(m => m.category === 'multimedia').sort((a, b) => a.order - b.order));
      setOutreach(members.filter(m => m.category === 'outreach').sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleSubmit = async () => {
    if (form.name && form.position && form.category) {
      setIsLoading(true);
      
      try {
        if (form.poster) {
          setUploadingImage(true);
          toast.loading('Uploading image...', { id: 'upload' });
        }
        
        const allMembers = [...webops, ...multimedia, ...outreach];
        const categoryMembers = allMembers.filter(m => m.category === form.category);
        const maxOrder = categoryMembers.length > 0 ? Math.max(...categoryMembers.map(m => m.order)) : 0;
        
        if (editingMember) {
          await updateTeamMember(editingMember.id, {
            name: form.name,
            position: form.position,
            category: form.category
          }, form.poster || undefined);
          toast.success('Team member updated successfully!', { id: 'upload' });
        } else {
          await saveTeamMember({
            name: form.name,
            position: form.position,
            category: form.category,
            isVisible: true,
            order: maxOrder + 1
          }, form.poster || undefined);
          toast.success('Team member added successfully!', { id: 'upload' });
        }
        
        await loadTeamMembers();
        setForm({ name: "", position: "", category: "", poster: null });
        setEditingMember(null);
        setShowForm(false);
      } catch (error) {
        console.error('Error saving team member:', error);
        toast.error('Failed to save team member. Please try again.', { id: 'upload' });
      } finally {
        setIsLoading(false);
        setUploadingImage(false);
      }
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      const member = [...webops, ...multimedia, ...outreach].find(m => m.id === id);
      if (member) {
        toast.loading('Updating visibility...', { id: 'visibility' });
        await updateTeamMember(id, { isVisible: !member.isVisible });
        await loadTeamMembers();
        toast.success(`Member ${member.isVisible ? 'hidden' : 'shown'} successfully!`, { id: 'visibility' });
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility. Please try again.', { id: 'visibility' });
    }
  };

  const openDeleteDialog = (id: string) => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admin can delete members.');
      return;
    }
    
    const member = [...webops, ...multimedia, ...outreach].find(m => m.id === id);
    if (!member) {
      toast.error('Member not found.');
      return;
    }
    
    setDeleteDialog({ open: true, member });
  };

  const deleteMember = async () => {
    if (!deleteDialog.member) return;
    
    try {
      toast.loading('Deleting member...', { id: 'delete' });
      await deleteTeamMember(deleteDialog.member.id);
      await loadTeamMembers();
      toast.success(`${deleteDialog.member.name} deleted successfully!`, { id: 'delete' });
      setDeleteDialog({ open: false, member: null });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member. Please try again.', { id: 'delete' });
    }
  };

  const handleDragEnd = async (event: DragEndEvent, category: 'webops' | 'multimedia' | 'outreach') => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const items = category === 'webops' ? webops : category === 'multimedia' ? multimedia : outreach;
    const oldIndex = items.findIndex(m => m.id === active.id);
    const newIndex = items.findIndex(m => m.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex);
    
    if (category === 'webops') {
      setWebops(reordered);
    } else if (category === 'multimedia') {
      setMultimedia(reordered);
    } else {
      setOutreach(reordered);
    }

    try {
      const updates = reordered.map((member, index) => ({
        id: member.id,
        order: index
      }));
      await reorderTeamMembers(updates);
      toast.success('Order updated successfully!');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to update order');
      await loadTeamMembers();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const editMember = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name || '',
      position: member.position || '',
      category: member.category || '',
      poster: null
    });
    setShowForm(true);
  };

  const SortableCard = ({ member }: { member: TeamMember; category: 'webops' | 'multimedia' | 'outreach' }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: member.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style}>
        <Card className={`relative rounded-lg shadow-sm border-0 overflow-hidden p-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <div className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
            <div className={`p-1 rounded ${
              isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          </div>
          <div className="relative -mb-2">
          <div className="absolute top-2 right-2 z-10">
            <Badge className={`${
              member.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {member.isVisible ? 'Visible' : 'Hidden'}
            </Badge>
          </div>
          <div className={`w-full aspect-[3/4] flex items-center justify-center relative overflow-hidden ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
          }`}>
            {!member.isVisible && (
              <>
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-900/80 transform rotate-45 w-1 h-full left-1/2 -translate-x-1/2" style={{height: '150%', top: '-25%'}} />
                    <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </div>
                </div>
              </>
            )}
            {
              (() => {
                let imageSrc: string | null = null;
                if (!member.imageUrl) return (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                    <Upload className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No poster uploaded</p>
                  </div>
                );

                if (typeof member.imageUrl === 'string') {
                  imageSrc = member.imageUrl.trim() || null;
                } else if (typeof member.imageUrl === 'object' && member.imageUrl !== null) {
                  const imgObj = member.imageUrl as { url?: string; secure_url?: string; downloadURL?: string; path?: string };
                  imageSrc = imgObj.url || imgObj.secure_url || imgObj.downloadURL || imgObj.path || null;
                }

                if (!imageSrc) {
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                      <Upload className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No poster uploaded</p>
                    </div>
                  );
                }

                return <Image src={imageSrc} alt={member.position} width={720} height={960} className="w-full h-full object-cover rounded-lg" />;
              })()
            }
          </div>
        </div>
        <CardContent className="p-3 pt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className={`font-semibold text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{member.position}</h3>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{member.name}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleVisibility(member.id)}
              className={`flex-1 h-8 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
            >
              {member.isVisible ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => editMember(member)}
              className="flex-1 h-8 text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            
            {isSuperAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDeleteDialog(member.id)}
                className="flex-1 h-8 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageLayout title="Teams Management" subtitle="Manage team member posters and visibility" activeItem="Teams" isLoading={isLoading}>
      <div className="space-y-8">
        <div className="flex items-center justify-end">
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Web-Ops Section */}
        <div>
          <h3 className={`text-xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Web-Ops</h3>
          
          {webops.length === 0 ? (
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-12 text-center">
                <Users className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>No Web-Ops members added yet</p>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'webops')}
            >
              <SortableContext items={webops.map(m => m.id)} strategy={horizontalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl">
                  {webops.map((member) => (
                    <SortableCard key={member.id} member={member} category="webops" />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Multimedia Section */}
        <div>
          <h3 className={`text-xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Multimedia</h3>
          
          {multimedia.length === 0 ? (
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-12 text-center">
                <Users className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>No Multimedia members added yet</p>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'multimedia')}
            >
              <SortableContext items={multimedia.map(m => m.id)} strategy={horizontalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl">
                  {multimedia.map((member) => (
                    <SortableCard key={member.id} member={member} category="multimedia" />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Out Reach Section */}
        <div>
          <h3 className={`text-xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Out Reach</h3>
          
          {outreach.length === 0 ? (
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-12 text-center">
                <Users className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>No Out Reach members added yet</p>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'outreach')}
            >
              <SortableContext items={outreach.map(m => m.id)} strategy={horizontalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl">
                  {outreach.map((member) => (
                    <SortableCard key={member.id} member={member} category="outreach" />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black/60 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl border transform transition-all ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 text-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Full Name</label>
                    <Input 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Enter full name"
                      className={`h-12 rounded-xl border-2 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 focus:border-teal-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-teal-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Position</label>
                    <Input 
                      value={form.position}
                      onChange={(e) => setForm({...form, position: e.target.value})}
                      placeholder="Enter position"
                      className={`h-12 rounded-xl border-2 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 focus:border-teal-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-teal-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Category</label>
                    <Select value={form.category} onValueChange={(value: 'webops' | 'multimedia' | 'outreach') => setForm({...form, category: value})}>
                      <SelectTrigger className={`h-12 rounded-xl border-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Upload Poster</label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-teal-500 bg-gray-700' 
                        : 'border-gray-300 hover:border-teal-500 bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({...form, poster: e.target.files?.[0] || null})}
                        className="hidden"
                        id="team-poster"
                      />
                      <label htmlFor="team-poster" className="cursor-pointer">
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {form.poster ? form.poster.name : 'Click to upload poster'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                    disabled={!form.name || !form.position || !form.category || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingImage ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      editingMember ? 'Update Member' : 'Add Member'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingMember(null);
                      setForm({ name: "", position: "", category: "", poster: null });
                    }} 
                    className={`flex-1 h-12 rounded-xl font-semibold ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, member: null })}>
          <DialogContent className={`sm:max-w-md ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <DialogTitle className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Delete Member
                  </DialogTitle>
                  <DialogDescription className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    This action cannot be undone.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className={`py-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>
                Are you sure you want to delete <span className="font-semibold">{deleteDialog.member?.name}</span>? 
                This will permanently remove their information and image from the system.
              </p>
            </div>
            
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, member: null })}
                className={`flex-1 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </Button>
              <Button
                onClick={deleteMember}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    
      </div>
      
    </PageLayout>
  );
}

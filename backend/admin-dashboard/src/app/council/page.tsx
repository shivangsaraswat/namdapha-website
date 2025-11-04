"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Eye, EyeOff, Trash2, Plus, Crown, Shield, Edit, Loader2, AlertTriangle, GripVertical } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import { saveCouncilMember, getCouncilMembers, updateCouncilMember, deleteCouncilMember, reorderCouncilMembers, CouncilMember } from "@/lib/councilService";
import { toast } from "sonner";
import { useDeletePermission } from "@/hooks/useDeletePermission";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const leadershipPositions = [
  { value: "secretary", label: "Secretary" },
  { value: "deputy-secretary", label: "Deputy Secretary" },
  { value: "web-admin", label: "Web - Admin" },
];

const regions = [
  "North Region", "South Region", "East Region", "West Region", "Central Region",
  "Northeast Region", "Southeast Region", "Southwest Region", "Northwest Region", "Upper Region"
];

export default function Council() {
  const { isDarkMode } = useTheme();
  const { canDelete: canDeleteLeadership } = useDeletePermission('council-leadership');
  const { canDelete: canDeleteCoordinators } = useDeletePermission('council-coordinators');
  
  const [leadership, setLeadership] = useState<CouncilMember[]>([]);
  const [coordinators, setCoordinators] = useState<CouncilMember[]>([]);
  const [showLeadershipForm, setShowLeadershipForm] = useState(false);
  const [showCoordinatorForm, setShowCoordinatorForm] = useState(false);
  const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, member: CouncilMember | null, type: 'leadership' | 'coordinator' | null}>({open: false, member: null, type: null});
  
  const [leadershipForm, setLeadershipForm] = useState({
    name: "",
    position: "",
    poster: null as File | null
  });
  
  const [coordinatorForm, setCoordinatorForm] = useState({
    name: "",
    region: "",
    poster: null as File | null
  });

  useEffect(() => {
    loadCouncilMembers();
  }, []);

  const loadCouncilMembers = async () => {
    try {
      const members = await getCouncilMembers();
      setLeadership(members.filter(m => m.type === 'leadership'));
      setCoordinators(members.filter(m => m.type === 'coordinator'));
    } catch (error) {
      console.error('Error loading council members:', error);
    }
  };

  const handleAddLeadership = async () => {
    if (leadershipForm.name && leadershipForm.position) {
      const selectedPosition = leadershipPositions.find(p => p.value === leadershipForm.position);
      setIsLoading(true);
      
      try {
        if (leadershipForm.poster) {
          setUploadingImage(true);
          toast.loading('Uploading image...', { id: 'upload' });
        }
        
        if (editingMember && editingMember.type === 'leadership') {
          await updateCouncilMember(editingMember.id, {
            name: leadershipForm.name,
            position: selectedPosition?.label || ""
          }, leadershipForm.poster || undefined);
          toast.success('Leadership member updated successfully!', { id: 'upload' });
        } else {
          await saveCouncilMember({
            name: leadershipForm.name,
            position: selectedPosition?.label || "",
            type: 'leadership',
            isVisible: true
          }, leadershipForm.poster || undefined);
          toast.success('Leadership member added successfully!', { id: 'upload' });
        }
        
        await loadCouncilMembers();
        setLeadershipForm({ name: "", position: "", poster: null });
        setEditingMember(null);
        setShowLeadershipForm(false);
      } catch (error) {
        console.error('Error saving leadership member:', error);
        toast.error('Failed to save leadership member. Please try again.', { id: 'upload' });
      } finally {
        setIsLoading(false);
        setUploadingImage(false);
      }
    }
  };

  const handleAddCoordinator = async () => {
    if (coordinatorForm.name && coordinatorForm.region) {
      setIsLoading(true);
      
      try {
        if (coordinatorForm.poster) {
          setUploadingImage(true);
          toast.loading('Uploading image...', { id: 'upload' });
        }
        
        if (editingMember && editingMember.type === 'coordinator') {
          await updateCouncilMember(editingMember.id, {
            name: coordinatorForm.name,
            position: coordinatorForm.region
          }, coordinatorForm.poster || undefined);
          toast.success('Regional coordinator updated successfully!', { id: 'upload' });
        } else {
          await saveCouncilMember({
            name: coordinatorForm.name,
            position: coordinatorForm.region,
            type: 'coordinator',
            isVisible: true
          }, coordinatorForm.poster || undefined);
          toast.success('Regional coordinator added successfully!', { id: 'upload' });
        }
        
        await loadCouncilMembers();
        setCoordinatorForm({ name: "", region: "", poster: null });
        setEditingMember(null);
        setShowCoordinatorForm(false);
      } catch (error) {
        console.error('Error saving coordinator:', error);
        toast.error('Failed to save coordinator. Please try again.', { id: 'upload' });
      } finally {
        setIsLoading(false);
        setUploadingImage(false);
      }
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      const member = [...leadership, ...coordinators].find(m => m.id === id);
      if (member) {
        toast.loading('Updating visibility...', { id: 'visibility' });
        await updateCouncilMember(id, { isVisible: !member.isVisible });
        await loadCouncilMembers();
        toast.success(`Member ${member.isVisible ? 'hidden' : 'shown'} successfully!`, { id: 'visibility' });
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility. Please try again.', { id: 'visibility' });
    }
  };

  const openDeleteDialog = (id: string, type: 'leadership' | 'coordinator') => {
    const hasPermission = type === 'leadership' ? canDeleteLeadership : canDeleteCoordinators;
    
    if (!hasPermission) {
      toast.error(
        `You don't have permission to delete ${type === 'leadership' ? 'leadership members' : 'regional coordinators'}. Ask Super Admin to grant permission, or you can edit details and change visibility.`,
        { duration: 7000, style: { maxWidth: '500px' } }
      );
      return;
    }
    
    const member = [...leadership, ...coordinators].find(m => m.id === id);
    if (!member) {
      toast.error('Member not found.');
      return;
    }
    
    setDeleteDialog({ open: true, member, type });
  };

  const deleteMember = async () => {
    if (!deleteDialog.member) return;
    
    try {
      toast.loading('Deleting member...', { id: 'delete' });
      await deleteCouncilMember(deleteDialog.member.id);
      await loadCouncilMembers();
      toast.success(`${deleteDialog.member.name} deleted successfully!`, { id: 'delete' });
      setDeleteDialog({ open: false, member: null, type: null });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member. Please try again.', { id: 'delete' });
    }
  };

  const editMember = (member: CouncilMember, type: 'leadership' | 'coordinator') => {
    setEditingMember({ ...member, type });
    if (type === 'leadership') {
      setLeadershipForm({
        name: member.name || '',
        position: leadershipPositions.find(p => p.label === member.position)?.value || '',
        poster: null
      });
      setShowLeadershipForm(true);
    } else {
      setCoordinatorForm({
        name: member.name || '',
        region: member.position || '',
        poster: null
      });
      setShowCoordinatorForm(true);
    }
  };

  const SortableCard = ({ member, memberType }: { member: CouncilMember; memberType: 'leadership' | 'coordinator' }) => {
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
              <GripVertical className="w-4 h-4" />
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
                // Normalize image source (accept string or object shapes)
                let imageSrc: string | null = null;
                if (!member.imageUrl) return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
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
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Upload className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No poster uploaded</p>
                    </div>
                  );
                }

                const isSvg = imageSrc.includes('data:image/svg+xml') || imageSrc.endsWith('.svg');

                return (
                  (isSvg ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageSrc} alt={member.position} className="w-full h-full object-cover rounded-lg" />
                    </>
                  ) : (
                    <Image src={imageSrc} alt={member.position} width={720} height={960} className="w-full h-full object-cover rounded-lg" />
                  ))
                );
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
              onClick={() => editMember(member, memberType)}
              className="flex-1 h-8 text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDeleteDialog(member.id, memberType)}
              className="flex-1 h-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    );
  };

  const handleDragEnd = async (event: DragEndEvent, type: 'leadership' | 'coordinator') => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const items = type === 'leadership' ? leadership : coordinators;
    const oldIndex = items.findIndex(m => m.id === active.id);
    const newIndex = items.findIndex(m => m.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex);
    
    if (type === 'leadership') {
      setLeadership(reordered);
    } else {
      setCoordinators(reordered);
    }

    try {
      const updates = reordered.map((member, index) => ({
        id: member.id,
        order: index
      }));
      await reorderCouncilMembers(updates);
      toast.success('Order updated successfully!');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to update order');
      await loadCouncilMembers();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <PageLayout title="Council Management" subtitle="Manage council member posters and visibility" activeItem="Council" isLoading={isLoading}>
      <div className="space-y-8">

        {/* House Leadership Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>House Leadership</h3>
            <Button 
              onClick={() => setShowLeadershipForm(true)}
              className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Leadership
            </Button>
          </div>
          
          {leadership.length === 0 ? (
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-12 text-center">
                <Crown className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>No leadership members added yet</p>
                <p className={`text-sm mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Click &quot;Add Leadership&quot; to get started</p>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'leadership')}
            >
              <SortableContext items={leadership.map(m => m.id)} strategy={horizontalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl">
                  {leadership.map((member) => (
                    <SortableCard key={member.id} member={member} memberType="leadership" />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Regional Coordinators Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Regional Coordinators</h3>
            <Button 
              onClick={() => setShowCoordinatorForm(true)}
              className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Coordinator
            </Button>
          </div>
          
          {coordinators.length === 0 ? (
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-12 text-center">
                <Shield className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>No regional coordinators added yet</p>
                <p className={`text-sm mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Click &quot;Add Coordinator&quot; to get started</p>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, 'coordinator')}
            >
              <SortableContext items={coordinators.map(m => m.id)} strategy={horizontalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl">
                  {coordinators.map((member) => (
                    <SortableCard key={member.id} member={member} memberType="coordinator" />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Add Leadership Form Modal */}
        {showLeadershipForm && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black/60 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl border transform transition-all ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 text-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{editingMember ? 'Edit Leadership Member' : 'Add Leadership Member'}</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Full Name</label>
                    <Input 
                      value={leadershipForm.name}
                      onChange={(e) => setLeadershipForm({...leadershipForm, name: e.target.value})}
                      placeholder="Enter full name"
                      className={`h-12 rounded-xl border-2 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 focus:border-purple-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Position</label>
                    <Select value={leadershipForm.position} onValueChange={(value) => setLeadershipForm({...leadershipForm, position: value})}>
                      <SelectTrigger className={`h-12 rounded-xl border-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadershipPositions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
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
                        ? 'border-gray-600 hover:border-purple-500 bg-gray-700' 
                        : 'border-gray-300 hover:border-purple-500 bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept="image/*,image/svg+xml"
                        onChange={(e) => setLeadershipForm({...leadershipForm, poster: e.target.files?.[0] || null})}
                        className="hidden"
                        id="leadership-poster"
                      />
                      <label htmlFor="leadership-poster" className="cursor-pointer">
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {leadershipForm.poster ? leadershipForm.poster.name : 'Click to upload poster'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <Button 
                    onClick={handleAddLeadership} 
                    className="flex-1 h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    disabled={!leadershipForm.name || !leadershipForm.position || isLoading}
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
                      setShowLeadershipForm(false);
                      setEditingMember(null);
                      setLeadershipForm({ name: "", position: "", poster: null });
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

        {/* Add Coordinator Form Modal */}
        {showCoordinatorForm && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black/60 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl border transform transition-all ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 text-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{editingMember ? 'Edit Regional Coordinator' : 'Add Regional Coordinator'}</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Full Name</label>
                    <Input 
                      value={coordinatorForm.name}
                      onChange={(e) => setCoordinatorForm({...coordinatorForm, name: e.target.value})}
                      placeholder="Enter full name"
                      className={`h-12 rounded-xl border-2 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 focus:border-green-500 text-white' 
                          : 'bg-gray-50 border-gray-300 focus:border-green-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Region</label>
                    <Select value={coordinatorForm.region} onValueChange={(value) => setCoordinatorForm({...coordinatorForm, region: value})}>
                      <SelectTrigger className={`h-12 rounded-xl border-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
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
                        ? 'border-gray-600 hover:border-green-500 bg-gray-700' 
                        : 'border-gray-300 hover:border-green-500 bg-gray-50'
                    }`}>
                      <input
                        type="file"
                        accept="image/*,image/svg+xml"
                        onChange={(e) => setCoordinatorForm({...coordinatorForm, poster: e.target.files?.[0] || null})}
                        className="hidden"
                        id="coordinator-poster"
                      />
                      <label htmlFor="coordinator-poster" className="cursor-pointer">
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {coordinatorForm.poster ? coordinatorForm.poster.name : 'Click to upload poster'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <Button 
                    onClick={handleAddCoordinator} 
                    className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                    disabled={!coordinatorForm.name || !coordinatorForm.region || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingImage ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      editingMember ? 'Update Coordinator' : 'Add Coordinator'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCoordinatorForm(false);
                      setEditingMember(null);
                      setCoordinatorForm({ name: "", region: "", poster: null });
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
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, member: null, type: null })}>
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
                onClick={() => setDeleteDialog({ open: false, member: null, type: null })}
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
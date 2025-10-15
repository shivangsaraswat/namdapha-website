"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Eye, EyeOff, Trash2, Plus, Crown, Star, Shield, Edit, Loader2, AlertTriangle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { saveCouncilMember, getCouncilMembers, updateCouncilMember, deleteCouncilMember, CouncilMember } from "@/lib/councilService";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';
  
  const [leadership, setLeadership] = useState<CouncilMember[]>([]);
  const [coordinators, setCoordinators] = useState<CouncilMember[]>([]);
  const [showLeadershipForm, setShowLeadershipForm] = useState(false);
  const [showCoordinatorForm, setShowCoordinatorForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
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

  const toggleVisibility = async (id: string, type: 'leadership' | 'coordinator') => {
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
    if (!isSuperAdmin) {
      toast.error('Only Super Admin can delete members.');
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

  const editMember = (member: any, type: 'leadership' | 'coordinator') => {
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

  const MemberCard = ({ member, type }: { member: any, type: 'leadership' | 'coordinator' }) => {
    
    return (
      <Card className={`rounded-2xl shadow-sm border-0 ${
        isDarkMode ? 'bg-gray-700' : 'bg-white'
      } ${!member.isVisible ? 'opacity-50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{member.position}</h3>
            </div>
            <Badge className={`${
              member.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {member.isVisible ? 'Visible' : 'Hidden'}
            </Badge>
          </div>

          <div className={`w-full h-[420px] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden ${
            isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
          }`}>
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
                  imageSrc = (member.imageUrl as any).url || (member.imageUrl as any).secure_url || (member.imageUrl as any).downloadURL || (member.imageUrl as any).path || null;
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
                    <img src={imageSrc} alt={member.position} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Image src={imageSrc} alt={member.position} width={720} height={960} className="w-full h-full object-cover rounded-lg" />
                  ))
                );
              })()
            }
          </div>

          <div className="flex items-center justify-between">
            <div className={`font-semibold text-lg ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {member.name}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVisibility(member.id, type)}
                className={`${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
              >
                {member.isVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => editMember(member, type)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              {isSuperAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(member.id, type)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageLayout title="Council" activeItem="Council">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Council Management</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Manage council member posters and visibility</p>
          </div>
        </div>

        {/* House Leadership Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>House Leadership</h3>
            <Button 
              onClick={() => setShowLeadershipForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
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
                }`}>Click "Add Leadership" to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadership.map((member) => (
                <MemberCard key={member.id} member={member} type="leadership" />
              ))}
            </div>
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
              className="bg-green-600 hover:bg-green-700 text-white"
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
                }`}>Click "Add Coordinator" to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coordinators.map((member) => (
                <MemberCard key={member.id} member={member} type="coordinator" />
              ))}
            </div>
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
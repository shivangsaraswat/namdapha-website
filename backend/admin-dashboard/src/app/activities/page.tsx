"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { activitiesService, Activity } from "@/lib/activitiesService";
import { uploadImage } from "@/lib/imagekit";
import { toast } from "sonner";
import Image from "next/image";

const categories = ['Gaming & Strategy', 'Tech & Innovation', 'Arts, Expression & Public Speaking'] as const;

export default function Activities() {
  const { isDarkMode } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as Activity['category'] | '',
    logo: '',
    poster: '',
    registrationLink: '',
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesService.getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddClick = () => {
    setEditingActivity(null);
    setFormData({ name: '', description: '', category: '', logo: '', poster: '', registrationLink: '' });
    setIsDialogOpen(true);
  };

  const handleEditClick = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      category: activity.category,
      logo: activity.logo,
      poster: activity.poster,
      registrationLink: activity.registrationLink || '',
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'poster') => {
    setUploading(true);
    try {
      const result = await uploadImage(file, 'activities');
      setFormData(prev => ({ ...prev, [type]: result.url }));
      toast.success(`${type === 'logo' ? 'Logo' : 'Poster'} uploaded`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.category || !formData.logo || !formData.poster) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const maxOrder = activities.length > 0 ? Math.max(...activities.map(a => a.order)) : 0;

      if (editingActivity) {
        await activitiesService.updateActivity(editingActivity.id!, {
          ...formData,
          category: formData.category as Activity['category'],
        });
        toast.success('Activity updated');
      } else {
        await activitiesService.addActivity({
          ...formData,
          category: formData.category as Activity['category'],
          order: maxOrder + 1,
          isVisible: true,
        });
        toast.success('Activity added');
      }

      setIsDialogOpen(false);
      fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await activitiesService.deleteActivity(id);
      toast.success('Activity deleted');
      setDeleteConfirm(null);
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleToggleVisibility = async (activity: Activity) => {
    try {
      await activitiesService.updateActivity(activity.id!, {
        isVisible: !activity.isVisible
      });
      toast.success(`Activity ${activity.isVisible ? 'hidden' : 'shown'}`);
      fetchActivities();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const groupedActivities = categories.reduce((acc, cat) => {
    acc[cat] = activities.filter(a => a.category === cat);
    return acc;
  }, {} as Record<string, Activity[]>);

  const seedInitialData = async () => {
    const initialData = [
      { name: "Valorant Vanguards", description: "Tactical minds meet here — participate in Valorant tournaments, discussions, and team-building for the win.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Gaming & Strategy", order: 1 },
      { name: "Clanforge", description: "Build, battle, and bond — unite with fellow strategists for casual and competitive Clash of Clans gaming.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Gaming & Strategy", order: 2 },
      { name: "The Battleground", description: "Squad up for high-octane BGMI matches — from fun room games to intense competitions, we play it all.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Gaming & Strategy", order: 3 },
      { name: "Knights64", description: "Check your mind and master your moves through tournaments, puzzles, and engaging chess discussions.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Gaming & Strategy", order: 4 },
      { name: "FireStorm", description: "For those who live for the thrill of battle — join casual and competitive Free Fire matches with your housemates.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Gaming & Strategy", order: 5 },
      { name: "Geek Squad", description: "A reserved circle for true tech enthusiasts — coding, hackathons, robotics, and serious team collaborations await.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Tech & Innovation", order: 6 },
      { name: "ElectroSphere", description: "A dedicated space for ES students of our house — connect, collaborate, and share course updates and opportunities.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Tech & Innovation", order: 7 },
      { name: "Trivia Titans", description: "Fuel your curiosity with quizzes, trivia nights, and practice sessions designed to challenge and excite your mind.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Tech & Innovation", order: 8 },
      { name: "Kavya", description: "A haven for poets, storytellers, and writers - let your imagination flow through verses, tales, and creative expression.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Arts, Expression & Public Speaking", order: 9 },
      { name: "Pulse of Arts", description: "Where creativity comes alive — showcase your talent in photography, dance, music, sketching, and all things artistic.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Arts, Expression & Public Speaking", order: 10 },
      { name: "The Podium", description: "Where words win wars — join for debates, JAMs, and public speaking sessions that sharpen your expression and confidence.", logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg", poster: "https://res.cloudinary.com/demo/image/upload/sample.jpg", category: "Arts, Expression & Public Speaking", order: 11 },
    ];

    try {
      for (const activity of initialData) {
        await activitiesService.addActivity({ ...activity, registrationLink: '', isVisible: true });
      }
      toast.success('Activities seeded successfully!');
      fetchActivities();
    } catch (error) {
      console.error('Error seeding activities:', error);
      toast.error('Failed to seed activities');
    }
  };

  return (
    <PageLayout title="Activities Management" subtitle="Manage house activities and communities" activeItem="Activities" isLoading={loading}>
      <div className="space-y-8">
        <div className="flex justify-end">
          <Button className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm" onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>

        {activities.length === 0 && !loading ? (
          <Card className={`p-8 text-center space-y-4 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No activities yet</p>
            <Button onClick={seedInitialData} className="bg-green-600 hover:bg-green-700 text-white">
              Seed Initial Activities (11 items)
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {categories.map(cat => {
              const items = groupedActivities[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat} className="max-w-6xl">
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cat}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {items.map(activity => (
                      <Card key={activity.id} className={`rounded-xl shadow-sm border-0 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                        <div className="relative w-full h-32">
                          <Image src={activity.poster} alt={activity.name} fill className="object-cover rounded-t-xl" />
                          <div className="absolute top-2 right-2">
                            <Badge className={activity.isVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                              {activity.isVisible ? 'Visible' : 'Hidden'}
                            </Badge>
                          </div>
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-white overflow-hidden flex items-center justify-center">
                            <Image src={activity.logo} alt={activity.name} width={80} height={80} className="object-cover w-full h-full" />
                          </div>
                        </div>
                        <CardContent className="p-3 pt-11 space-y-0.5">
                          <h3 className={`font-semibold text-sm line-clamp-1 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.name}</h3>
                          <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
                          {activity.registrationLink && (
                            <a href={activity.registrationLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline block truncate">
                              Registration Link
                            </a>
                          )}
                          <div className={`border-t pt-2.5 mt-3 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => handleToggleVisibility(activity)}>
                              {activity.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => handleEditClick(activity)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => setDeleteConfirm(activity.id!)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} max-w-2xl max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Edit' : 'Add'} Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-red-500">*</span></Label>
              <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
            </div>
            <div className="space-y-2">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val as Activity['category'] }))}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Logo <span className="text-red-500">*</span></Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')} disabled={uploading} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
              {formData.logo && <Image src={formData.logo} alt="Logo" width={80} height={80} className="rounded-full" />}
            </div>
            <div className="space-y-2">
              <Label>Poster <span className="text-red-500">*</span></Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'poster')} disabled={uploading} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
              {formData.poster && <Image src={formData.poster} alt="Poster" width={200} height={150} className="rounded-lg" />}
            </div>
            <div className="space-y-2">
              <Label>Registration Link</Label>
              <Input value={formData.registrationLink} onChange={(e) => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))} placeholder="https://forms.google.com/..." className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={uploading}>{editingActivity ? 'Update' : 'Add'} Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this activity?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </PageLayout>
  );
}

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
import { Plus, Edit, Trash2, Eye, EyeOff, Video, ArrowLeft, ExternalLink, Play } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { videoLectureService, VideoLecture } from "@/lib/videoLectureService";
import { toast } from "sonner";
import { useDeletePermission } from "@/hooks/useDeletePermission";

const levels = ["Foundation", "Diploma", "BSc", "BS"];

export default function VideoLecturesManagement() {
  const { isDarkMode } = useTheme();
  const { canDelete: canDeleteVideos } = useDeletePermission('resource-hub-videos');
  const [videos, setVideos] = useState<VideoLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState({
    level: 'All',
    subject: 'All',
    videoType: 'All',
    status: 'All',
  });
  const INITIAL_LOAD = 8;
  const LOAD_MORE = 8;
  
  const filteredVideos = videos.filter(video => {
    if (filters.level !== 'All' && video.level !== filters.level) return false;
    if (filters.subject !== 'All' && video.subject !== filters.subject) return false;
    if (filters.videoType !== 'All' && video.videoType !== filters.videoType) return false;
    if (filters.status === 'Hidden' && video.status !== 'draft') return false;
    if (filters.status === 'Published' && video.status !== 'published') return false;
    return true;
  });

  const videosByLevel = levels.reduce((acc, level) => {
    acc[level] = filteredVideos
      .filter(video => video.level === level)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    return acc;
  }, {} as Record<string, VideoLecture[]>);

  const uniqueSubjects = Array.from(new Set(videos.map(v => v.subject))).sort();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLecture | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [visibilityConfirm, setVisibilityConfirm] = useState<VideoLecture | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    videoUrl: '',
    videoType: 'youtube' as 'youtube' | 'playlist' | 'other',
    thumbnailUrl: '',
    instructor: '',
    duration: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    levels.forEach(level => {
      initialCounts[level] = INITIAL_LOAD;
    });
    setVisibleCounts(initialCounts);
  }, [videos]);

  const handleLoadMore = (level: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [level]: (prev[level] || INITIAL_LOAD) + LOAD_MORE
    }));
    
    setTimeout(() => {
      setVisibleCounts(prev => ({
        ...prev,
        [level]: INITIAL_LOAD
      }));
    }, 10000);
  };

  const resetFilters = () => {
    setFilters({
      level: 'All',
      subject: 'All',
      videoType: 'All',
      status: 'All',
    });
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await videoLectureService.getAllVideoLectures();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load video lectures');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      subject: '',
      level: '',
      videoUrl: '',
      videoType: 'youtube',
      thumbnailUrl: '',
      instructor: '',
      duration: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (video: VideoLecture) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      subject: video.subject,
      level: video.level,
      videoUrl: video.videoUrl,
      videoType: video.videoType,
      thumbnailUrl: video.thumbnailUrl || '',
      instructor: video.instructor || '',
      duration: video.duration || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.subject || !formData.level || !formData.videoUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const videoData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        level: formData.level,
        videoUrl: formData.videoUrl,
        videoType: formData.videoType,
        thumbnailUrl: formData.thumbnailUrl,
        instructor: formData.instructor,
        duration: formData.duration,
        status: 'published' as const,
        views: 0,
      };

      if (editingVideo) {
        await videoLectureService.updateVideoLecture(editingVideo.id!, {
          ...videoData,
          updatedAt: new Date(),
        });
        toast.success('Video lecture updated successfully');
      } else {
        await videoLectureService.addVideoLecture({
          ...videoData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('Video lecture added successfully');
      }

      setIsDialogOpen(false);
      await fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video lecture');
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteVideos) {
      toast.error(
        "You don't have permission to delete video lectures. Ask Super Admin to grant permission.",
        { duration: 7000, style: { maxWidth: '500px' } }
      );
      setDeleteConfirm(null);
      return;
    }
    
    try {
      await videoLectureService.deleteVideoLecture(id);
      toast.success('Video lecture deleted successfully');
      setDeleteConfirm(null);
      await fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video lecture');
    }
  };

  const handleToggleVisibility = async (video: VideoLecture) => {
    try {
      const newStatus = video.status === 'published' ? 'draft' : 'published';
      await videoLectureService.updateVideoLecture(video.id!, { status: newStatus });
      toast.success(`Video ${newStatus === 'published' ? 'published' : 'hidden'} successfully`);
      setVisibilityConfirm(null);
      await fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    }
  };

  return (
    <>
      <div className="space-y-6 mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/resource-hub'}
            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resource Hub
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-2" />
            Add Video Lecture
          </Button>
        </div>

        <div className="flex items-end justify-end gap-2 mb-6">
          <div className="w-40">
            <Label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Level</Label>
            <Select value={filters.level} onValueChange={(val) => setFilters({...filters, level: val})}>
              <SelectTrigger className={`h-9 text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                <SelectValue className="truncate" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectItem value="All" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>All Levels</SelectItem>
                {levels.map(l => <SelectItem key={l} value={l} className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subject</Label>
            <Select value={filters.subject} onValueChange={(val) => setFilters({...filters, subject: val})}>
              <SelectTrigger className={`h-9 text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                <SelectValue className="truncate" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectItem value="All" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>All Subjects</SelectItem>
                {uniqueSubjects.map(s => <SelectItem key={s} value={s} className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-36">
            <Label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type</Label>
            <Select value={filters.videoType} onValueChange={(val) => setFilters({...filters, videoType: val})}>
              <SelectTrigger className={`h-9 text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                <SelectValue className="truncate" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectItem value="All" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>All Types</SelectItem>
                <SelectItem value="youtube" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>YouTube</SelectItem>
                <SelectItem value="playlist" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>Playlist</SelectItem>
                <SelectItem value="other" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <Label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</Label>
            <Select value={filters.status} onValueChange={(val) => setFilters({...filters, status: val})}>
              <SelectTrigger className={`h-9 text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                <SelectValue className="truncate" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectItem value="All" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>All Status</SelectItem>
                <SelectItem value="Published" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>Published</SelectItem>
                <SelectItem value="Hidden" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters} className={`h-9 px-4 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}>
            Reset
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading video lectures...</p>
        </div>
      ) : videos.length === 0 ? (
        <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardContent className="py-8">
            <div className="text-center">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No video lectures yet</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredVideos.length === 0 ? (
        <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardContent className="py-12">
            <div className="text-center">
              <Video className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No Videos Found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Try using a different filter combination
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {levels.map((level) => {
            const levelVideos = videosByLevel[level];
            if (levelVideos.length === 0) return null;
            
            return (
              <Card key={level} className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {level}
                      </CardTitle>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {levelVideos.length} video{levelVideos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {levelVideos.slice(0, visibleCounts[level] || INITIAL_LOAD).map((video) => {
                      const isInactive = video.status === 'draft';
                      return (
                      <Card key={video.id} className={`p-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} border-0 shadow-sm hover:shadow-md transition-shadow ${isInactive ? 'opacity-50 bg-gray-300 dark:bg-gray-800' : ''}`}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <Video className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <Badge className={`text-xs ${video.videoType === 'playlist' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                              {video.videoType}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className={`font-semibold text-base mb-1 line-clamp-2 ${isInactive ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {video.title}
                            </h4>
                            <p className={`text-xs mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {video.description}
                            </p>
                            <div className="space-y-1.5 text-sm">
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="text-xs">{video.subject}</span>
                              </div>
                              {video.instructor && (
                                <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <span>By {video.instructor}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Badge className={`${video.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs`}>
                                  {video.status}
                                </Badge>
                                <span className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <Play className="w-3 h-3" />
                                  {video.views || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-1 pt-2 border-t ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}>
                            <Button variant="ghost" size="sm" onClick={() => window.open(video.videoUrl, '_blank')} title="View" className="flex-1">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setVisibilityConfirm(video)} title={video.status === 'published' ? 'Hide' : 'Show'} className="flex-1">
                              {video.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(video)} title="Edit" className="flex-1">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(video.id!)} title="Delete" className="flex-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )})}
                  </div>
                  {levelVideos.length > (visibleCounts[level] || INITIAL_LOAD) && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={() => handleLoadMore(level)}
                        className={isDarkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-600' : ''}
                      >
                        Load More ({levelVideos.length - (visibleCounts[level] || INITIAL_LOAD)} remaining)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} max-w-2xl max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingVideo ? 'Edit Video Lecture' : 'Add New Video Lecture'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter video title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Enter video description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Degree Level <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level} className={isDarkMode ? 'text-white hover:bg-gray-600 focus:bg-gray-600' : ''}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Video Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.videoType} onValueChange={(val: 'youtube' | 'playlist' | 'other') => setFormData({ ...formData, videoType: val })}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    <SelectItem value="youtube" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>YouTube Video</SelectItem>
                    <SelectItem value="playlist" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>YouTube Playlist</SelectItem>
                    <SelectItem value="other" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Duration
                </Label>
                <Input
                  placeholder="e.g., 45 mins"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Video URL <span className="text-red-500">*</span>
              </Label>
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Thumbnail URL
              </Label>
              <Input
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Instructor Name
              </Label>
              <Input
                placeholder="Enter instructor name"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
              {editingVideo ? 'Update' : 'Add'} Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Delete Video Lecture</DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to delete this video lecture? This action cannot be undone.
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

      <Dialog open={!!visibilityConfirm} onOpenChange={() => setVisibilityConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {visibilityConfirm?.status === 'published' ? 'Hide' : 'Show'} Video
            </DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to {visibilityConfirm?.status === 'published' ? 'hide' : 'show'} this video?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVisibilityConfirm(null)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={() => visibilityConfirm && handleToggleVisibility(visibilityConfirm)} className="bg-purple-600 hover:bg-purple-700 text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, Download, FileText, Link as LinkIcon, BookOpen, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { notesService, Note } from "@/lib/notesService";
import { toast } from "sonner";
import { useDeletePermission } from "@/hooks/useDeletePermission";

const years = ["2025", "2024", "2023", "2022", "2021"];
const levels = ["Foundation", "Diploma", "BSc", "BS"];

export default function NotesManagement() {
  const { isDarkMode } = useTheme();
  const { canDelete: canDeleteNotes } = useDeletePermission('resource-hub-notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [filters, setFilters] = useState({
    level: 'All',
    subject: 'All',
    year: 'All',
    status: 'All',
  });
  const INITIAL_LOAD = 8;
  const LOAD_MORE = 8;
  
  const filteredNotes = notes.filter(note => {
    if (filters.level !== 'All' && note.level !== filters.level) return false;
    if (filters.subject !== 'All' && note.subject !== filters.subject) return false;
    if (filters.year !== 'All' && note.year !== filters.year) return false;
    if (filters.status === 'Hidden' && note.status !== 'draft') return false;
    if (filters.status === 'Published' && note.status !== 'published') return false;
    return true;
  });

  const notesByLevel = levels.reduce((acc, level) => {
    acc[level] = filteredNotes
      .filter(note => note.level === level)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    return acc;
  }, {} as Record<string, Note[]>);

  const uniqueSubjects = Array.from(new Set(notes.map(n => n.subject))).sort();
  const existingSubjects = Array.from(new Set(notes.map(n => n.subject))).sort();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [visibilityConfirm, setVisibilityConfirm] = useState<Note | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    year: '',
    fileUrl: '',
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    levels.forEach(level => {
      initialCounts[level] = INITIAL_LOAD;
    });
    setVisibleCounts(initialCounts);
  }, [notes]);

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
      year: 'All',
      status: 'All',
    });
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      description: '',
      subject: '',
      level: '',
      year: '',
      fileUrl: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      subject: note.subject,
      level: note.level,
      year: note.year,
      fileUrl: note.fileUrl,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.subject || !formData.level || !formData.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.fileUrl) {
      toast.error('Please provide a file URL');
      return;
    }

    try {
      const noteData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        level: formData.level,
        year: formData.year,
        fileUrl: formData.fileUrl,
        fileType: 'link' as const,
        status: 'published' as const,
        downloads: 0,
      };

      if (editingNote) {
        await notesService.updateNote(editingNote.id!, {
          ...noteData,
          updatedAt: new Date(),
        });
        toast.success('Note updated successfully');
      } else {
        await notesService.addNote({
          ...noteData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('Note added successfully');
      }

      setIsDialogOpen(false);
      await fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteNotes) {
      toast.error(
        "You don't have permission to delete notes. Ask Super Admin to grant permission, or you can edit details and change visibility.",
        { duration: 7000, style: { maxWidth: '500px' } }
      );
      setDeleteConfirm(null);
      return;
    }
    
    try {
      await notesService.deleteNote(id);
      toast.success('Note deleted successfully');
      setDeleteConfirm(null);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleToggleVisibility = async (note: Note) => {
    try {
      const newStatus = note.status === 'published' ? 'draft' : 'published';
      await notesService.updateNote(note.id!, { status: newStatus });
      toast.success(`Note ${newStatus === 'published' ? 'published' : 'hidden'} successfully`);
      setVisibilityConfirm(null);
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const filteredSubjects = existingSubjects.filter(subject => 
    subject.toLowerCase().includes(formData.subject.toLowerCase())
  );

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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-2" />
            Add Note
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
          <div className="w-28">
            <Label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Year</Label>
            <Select value={filters.year} onValueChange={(val) => setFilters({...filters, year: val})}>
              <SelectTrigger className={`h-9 text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                <SelectValue className="truncate" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                <SelectItem value="All" className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={y} className={isDarkMode ? 'text-white hover:bg-gray-600' : ''}>{y}</SelectItem>)}
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
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardContent className="py-8">
            <div className="text-center">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No notes yet</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredNotes.length === 0 ? (
        <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No Notes Found
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {filters.status === 'Hidden' ? 'No hidden notes found' : 'Try using a different filter combination'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {levels.map((level) => {
            const levelNotes = notesByLevel[level];
            if (levelNotes.length === 0) return null;
            
            return (
              <Card key={level} className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {level}
                      </CardTitle>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {levelNotes.length} document{levelNotes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {levelNotes.slice(0, visibleCounts[level] || INITIAL_LOAD).map((note) => {
                      const isInactive = note.status === 'draft';
                      return (
                      <Card key={note.id} className={`p-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} border-0 shadow-sm hover:shadow-md transition-shadow ${isInactive ? 'opacity-50 bg-gray-300 dark:bg-gray-800' : ''}`}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <FileText className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            {note.fileType === 'link' && <LinkIcon className="w-4 h-4 text-blue-500" />}
                          </div>
                          
                          <div>
                            <h4 className={`font-semibold text-base mb-1 ${isInactive ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {note.title}
                            </h4>
                            <p className={`text-xs mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {note.description}
                            </p>
                            <div className="space-y-1.5 text-sm">
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{note.subject}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{note.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${note.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs`}>
                                  {note.status}
                                </Badge>
                                <span className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <Download className="w-3 h-3" />
                                  {note.downloads || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-1 pt-2 border-t ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}>
                            <Button variant="ghost" size="sm" onClick={() => window.open(note.fileUrl, '_blank')} title="View" className="flex-1">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setVisibilityConfirm(note)} title={note.status === 'published' ? 'Hide' : 'Show'} className="flex-1">
                              {note.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(note)} title="Edit" className="flex-1">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(note.id!)} title="Delete" className="flex-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )})}
                  </div>
                  {levelNotes.length > (visibleCounts[level] || INITIAL_LOAD) && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={() => handleLoadMore(level)}
                        className={isDarkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-600' : ''}
                      >
                        Load More ({levelNotes.length - (visibleCounts[level] || INITIAL_LOAD)} remaining)
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
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter note title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter short description (1-2 lines)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                maxLength={120}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.description.length}/120 characters
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Degree Level <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val, subject: '' })}>
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

              <div className="space-y-2 relative">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter or select subject"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    setShowSubjectSuggestions(true);
                  }}
                  onFocus={() => setShowSubjectSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSubjectSuggestions(false), 200)}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
                {showSubjectSuggestions && filteredSubjects.length > 0 && formData.subject && (
                  <div className={`absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border shadow-lg ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    {filteredSubjects.map((subject) => (
                      <div
                        key={subject}
                        className={`px-3 py-2 cursor-pointer ${
                          isDarkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'
                        }`}
                        onClick={() => {
                          setFormData({ ...formData, subject });
                          setShowSubjectSuggestions(false);
                        }}
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.year} onValueChange={(val) => setFormData({ ...formData, year: val })}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    {years.map((year) => (
                      <SelectItem key={year} value={year} className={isDarkMode ? 'text-white hover:bg-gray-600 focus:bg-gray-600' : ''}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                File URL <span className="text-red-500">*</span>
              </Label>
              <Input
                type="url"
                placeholder="https://example.com/file.pdf"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingNote ? 'Update' : 'Add'} Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Delete Note</DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to delete this note? This action cannot be undone.
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
              {visibilityConfirm?.status === 'published' ? 'Hide' : 'Show'} Note
            </DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to {visibilityConfirm?.status === 'published' ? 'hide' : 'show'} this note?
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

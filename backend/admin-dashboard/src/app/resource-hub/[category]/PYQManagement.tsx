"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff, Download, FileText, Link as LinkIcon, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { pyqService, PYQ } from "@/lib/pyqService";
import { toast } from "sonner";
import { useDeletePermission } from "@/hooks/useDeletePermission";

// Subject data (not used in admin, only in frontend)
// Commented out to avoid unused variable warning
// const _subjectsByLevel: Record<string, string[]> = {
//   "Foundation": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
//   "Diploma": ["Engineering Mathematics", "Computer Science", "Electronics", "Mechanical", "Civil Engineering"],
//   "BSc": ["Advanced Mathematics", "Quantum Physics", "Organic Chemistry", "Molecular Biology", "Statistics"],
//   "BS": ["Research Methodology", "Advanced Physics", "Computational Mathematics", "Biochemistry", "Data Science"]
// };

const years = ["2025", "2024", "2023", "2022", "2021"];
const semesters = ["January", "May", "September"];
const levels = ["Foundation", "Diploma", "BSc", "BS"];
const terms = ["Quiz 1", "Quiz 2", "End Term"];

export default function PYQManagement() {
  const { isDarkMode } = useTheme();
  const { canDelete: canDeletePYQs } = useDeletePermission('resource-hub-pyqs');
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  
  // Group PYQs by level
  const pyqsByLevel = levels.reduce((acc, level) => {
    acc[level] = pyqs.filter(pyq => pyq.level === level);
    return acc;
  }, {} as Record<string, PYQ[]>);
  
  // Get unique subjects from existing PYQs
  const existingSubjects = Array.from(new Set(pyqs.map(p => p.subject))).sort();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPYQ, setEditingPYQ] = useState<PYQ | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [visibilityConfirm, setVisibilityConfirm] = useState<PYQ | null>(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    level: '',
    term: '',
    semester: '',
    year: '',
    fileUrl: '',
  });

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const data = await pyqService.getAllPYQs();
      setPyqs(data);
    } catch (error) {
      console.error('Error fetching PYQs:', error);
      toast.error('Failed to load PYQs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingPYQ(null);
    setFormData({
      subject: '',
      level: '',
      term: '',
      semester: '',
      year: '',
      fileUrl: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (pyq: PYQ) => {
    setEditingPYQ(pyq);
    setFormData({
      subject: pyq.subject,
      level: pyq.level,
      term: pyq.term,
      semester: pyq.semester,
      year: pyq.year,
      fileUrl: pyq.fileUrl,
    });
    setIsDialogOpen(true);
  };



  const handleSave = async () => {
    if (!formData.subject || !formData.level || !formData.term || !formData.semester || !formData.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.fileUrl) {
      toast.error('Please provide a file URL');
      return;
    }

    try {
      const pyqData = {
        subject: formData.subject,
        level: formData.level,
        term: formData.term,
        semester: formData.semester,
        year: formData.year,
        fileUrl: formData.fileUrl,
        fileType: 'link' as const,
        status: 'published' as const,
        downloads: 0,
      };

      if (editingPYQ) {
        await pyqService.updatePYQ(editingPYQ.id!, {
          ...pyqData,
          updatedAt: new Date(),
        });
        toast.success('PYQ updated successfully');
      } else {
        await pyqService.addPYQ({
          ...pyqData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('PYQ added successfully');
      }

      setIsDialogOpen(false);
      await fetchPYQs();
    } catch (error) {
      console.error('Error saving PYQ:', error);
      toast.error('Failed to save PYQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeletePYQs) {
      toast.error(
        "You don't have permission to delete PYQs. Ask Super Admin to grant permission, or you can edit details and change visibility.",
        { duration: 7000, style: { maxWidth: '500px' } }
      );
      setDeleteConfirm(null);
      return;
    }
    
    try {
      await pyqService.deletePYQ(id);
      toast.success('PYQ deleted successfully');
      setDeleteConfirm(null);
      await fetchPYQs();
    } catch (error) {
      console.error('Error deleting PYQ:', error);
      toast.error('Failed to delete PYQ');
    }
  };

  const handleToggleVisibility = async (pyq: PYQ) => {
    try {
      const newStatus = pyq.status === 'published' ? 'draft' : 'published';
      await pyqService.updatePYQ(pyq.id!, { status: newStatus });
      toast.success(`PYQ ${newStatus === 'published' ? 'published' : 'hidden'} successfully`);
      setVisibilityConfirm(null);
      await fetchPYQs();
    } catch (error) {
      console.error('Error updating PYQ:', error);
      toast.error('Failed to update PYQ');
    }
  };

  // Filter subjects based on input
  const filteredSubjects = existingSubjects.filter(subject => 
    subject.toLowerCase().includes(formData.subject.toLowerCase())
  );

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
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add PYQ
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading PYQs...</p>
        </div>
      ) : pyqs.length === 0 ? (
        <Card className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <CardContent className="py-8">
            <div className="text-center">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No PYQs yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {levels.map((level) => {
            const levelPYQs = pyqsByLevel[level];
            if (levelPYQs.length === 0) return null;
            
            return (
              <Card key={level} className={`rounded-2xl shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <div>
                      <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {level}
                      </CardTitle>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {levelPYQs.length} document{levelPYQs.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {levelPYQs.map((pyq) => (
                      <Card key={pyq.id} className={`p-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} border-0 shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <FileText className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            {pyq.fileType === 'link' && <LinkIcon className="w-4 h-4 text-blue-500" />}
                          </div>
                          
                          <div>
                            <h4 className={`font-semibold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {pyq.subject}
                            </h4>
                            <div className="space-y-1.5 text-sm">
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{pyq.term}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{pyq.semester} {pyq.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${pyq.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-xs`}>
                                  {pyq.status}
                                </Badge>
                                <span className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <Download className="w-3 h-3" />
                                  {pyq.downloads || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 pt-2 border-t ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}">
                            <Button variant="ghost" size="sm" onClick={() => setVisibilityConfirm(pyq)} title={pyq.status === 'published' ? 'Hide' : 'Show'} className="flex-1">
                              {pyq.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(pyq)} title="Edit" className="flex-1">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(pyq.id!)} title="Delete" className="flex-1">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} max-w-2xl max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingPYQ ? 'Edit PYQ' : 'Add New PYQ'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                  Exam Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.term} onValueChange={(val) => setFormData({ ...formData, term: val })}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    {terms.map((term) => (
                      <SelectItem key={term} value={term} className={isDarkMode ? 'text-white hover:bg-gray-600 focus:bg-gray-600' : ''}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Term <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.semester} onValueChange={(val) => setFormData({ ...formData, semester: val })}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester} className={isDarkMode ? 'text-white hover:bg-gray-600 focus:bg-gray-600' : ''}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              {editingPYQ ? 'Update' : 'Add'} PYQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Delete PYQ</DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to delete this PYQ? This action cannot be undone.
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
              {visibilityConfirm?.status === 'published' ? 'Hide' : 'Show'} PYQ
            </DialogTitle>
          </DialogHeader>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to {visibilityConfirm?.status === 'published' ? 'hide' : 'show'} this PYQ?
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

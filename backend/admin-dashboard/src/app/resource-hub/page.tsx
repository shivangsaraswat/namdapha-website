"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, TrendingUp, FileText, Link, Users, MessageCircle, Calculator, BarChart3, GraduationCap, Newspaper, Video, Image as ImageIcon, Music, Code, Laptop, FlaskConical, Medal, Trophy, Award, ClipboardList, Plus, Edit, Trash2, Eye } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { resourceService, Resource, ResourceCategory } from "@/lib/resourceService";
import { initializeCategories } from "@/lib/initializeCategories";
import { pyqService } from "@/lib/pyqService";
import { notesService } from "@/lib/notesService";
import { videoLectureService } from "@/lib/videoLectureService";
import { contactService } from "@/lib/contactService";
import { linkService } from "@/lib/linkService";
import { bookService } from "@/lib/bookService";
import { toast } from "sonner";

// Icon mapping
const iconMap: {[key: string]: React.ComponentType<{className?: string}>} = {
  'FaBook': Book,
  'FaChartLine': TrendingUp,
  'FaFileAlt': FileText,
  'FaLink': Link,
  'FaAddressBook': Users,
  'FaWhatsapp': MessageCircle,
  'FaChartBar': BarChart3,
  'FaCalculator': Calculator,
  'FaGraduationCap': GraduationCap,
  'FaUsers': Users,
  'FaNewspaper': Newspaper,
  'FaVideo': Video,
  'FaImage': ImageIcon,
  'FaMusic': Music,
  'FaCode': Code,
  'FaLaptop': Laptop,
  'FaFlask': FlaskConical,
  'FaMedal': Medal,
  'FaTrophy': Trophy,
  'FaCertificate': Award,
  'FaClipboardList': ClipboardList
};

// Auto-generate icon based on category name
const getIconForCategory = (name: string): { icon: string; iconColor: string; bgColor: string } => {
  const lowerName = name.toLowerCase();
  
  // Academic & Study
  if (lowerName.includes('handbook') || lowerName.includes('book') || lowerName.includes('guide') || lowerName.includes('manual')) {
    return { icon: 'FaBook', iconColor: 'text-blue-600', bgColor: 'bg-blue-50' };
  } else if (lowerName.includes('student') || lowerName.includes('academic') || lowerName.includes('education')) {
    return { icon: 'FaGraduationCap', iconColor: 'text-purple-600', bgColor: 'bg-purple-50' };
  } else if (lowerName.includes('grade') || lowerName.includes('graded') || lowerName.includes('progress') || lowerName.includes('score')) {
    return { icon: 'FaChartLine', iconColor: 'text-green-600', bgColor: 'bg-green-50' };
  } else if (lowerName.includes('pyq') || lowerName.includes('question') || lowerName.includes('exam') || lowerName.includes('test') || lowerName.includes('paper')) {
    return { icon: 'FaFileAlt', iconColor: 'text-purple-600', bgColor: 'bg-purple-50' };
  } else if (lowerName.includes('assignment') || lowerName.includes('task') || lowerName.includes('homework')) {
    return { icon: 'FaClipboardList', iconColor: 'text-orange-600', bgColor: 'bg-orange-50' };
  }
  // Links & Resources
  else if (lowerName.includes('link') || lowerName.includes('portal') || lowerName.includes('website') || lowerName.includes('url')) {
    return { icon: 'FaLink', iconColor: 'text-orange-600', bgColor: 'bg-orange-50' };
  }
  // Contacts & People
  else if (lowerName.includes('contact') || lowerName.includes('directory') || lowerName.includes('faculty') || lowerName.includes('staff')) {
    return { icon: 'FaAddressBook', iconColor: 'text-red-600', bgColor: 'bg-red-50' };
  } else if (lowerName.includes('group') || lowerName.includes('team') || lowerName.includes('community') || lowerName.includes('club')) {
    return { icon: 'FaUsers', iconColor: 'text-blue-600', bgColor: 'bg-blue-50' };
  } else if (lowerName.includes('whatsapp') || lowerName.includes('chat')) {
    return { icon: 'FaWhatsapp', iconColor: 'text-green-600', bgColor: 'bg-green-50' };
  }
  // Tools & Calculators
  else if (lowerName.includes('predictor') || lowerName.includes('predict') || lowerName.includes('analytics')) {
    return { icon: 'FaChartBar', iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' };
  } else if (lowerName.includes('calculator') || lowerName.includes('calculate') || lowerName.includes('gpa') || lowerName.includes('cgpa')) {
    return { icon: 'FaCalculator', iconColor: 'text-teal-600', bgColor: 'bg-teal-50' };
  } else if (lowerName.includes('code') || lowerName.includes('programming') || lowerName.includes('software')) {
    return { icon: 'FaCode', iconColor: 'text-green-600', bgColor: 'bg-green-50' };
  } else if (lowerName.includes('lab') || lowerName.includes('experiment') || lowerName.includes('science')) {
    return { icon: 'FaFlask', iconColor: 'text-pink-600', bgColor: 'bg-pink-50' };
  } else if (lowerName.includes('computer') || lowerName.includes('laptop') || lowerName.includes('tech')) {
    return { icon: 'FaLaptop', iconColor: 'text-gray-600', bgColor: 'bg-gray-50' };
  }
  // Media
  else if (lowerName.includes('news') || lowerName.includes('article') || lowerName.includes('blog')) {
    return { icon: 'FaNewspaper', iconColor: 'text-gray-600', bgColor: 'bg-gray-50' };
  } else if (lowerName.includes('video') || lowerName.includes('lecture') || lowerName.includes('tutorial')) {
    return { icon: 'FaVideo', iconColor: 'text-red-600', bgColor: 'bg-red-50' };
  } else if (lowerName.includes('image') || lowerName.includes('photo') || lowerName.includes('gallery')) {
    return { icon: 'FaImage', iconColor: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  } else if (lowerName.includes('music') || lowerName.includes('audio')) {
    return { icon: 'FaMusic', iconColor: 'text-purple-600', bgColor: 'bg-purple-50' };
  }
  // Achievements
  else if (lowerName.includes('award') || lowerName.includes('achievement') || lowerName.includes('medal')) {
    return { icon: 'FaMedal', iconColor: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  } else if (lowerName.includes('trophy') || lowerName.includes('competition') || lowerName.includes('contest')) {
    return { icon: 'FaTrophy', iconColor: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  } else if (lowerName.includes('certificate') || lowerName.includes('certification')) {
    return { icon: 'FaCertificate', iconColor: 'text-blue-600', bgColor: 'bg-blue-50' };
  }
  
  return { icon: 'FaBook', iconColor: 'text-gray-600', bgColor: 'bg-gray-50' };
};

// Default categories (not used in this component, managed via Firebase)
// Commented out to avoid unused variable warning
/*
const _defaultCategories = [
  {
    id: 1,
    name: "Student Handbook",
    description: "Manage comprehensive study materials and course handbooks",
    icon: Book,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    count: 12,
    category: "Study Materials"
  },
  {
    id: 2,
    name: "Grading Document",
    description: "Manage academic progress tracking and graded assignments",
    icon: TrendingUp,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    count: 8,
    category: "Academic"
  },
  {
    id: 3,
    name: "PYQs",
    description: "Manage Previous Year Questions papers for exam preparation",
    icon: FileText,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    count: 24,
    category: "Study Materials"
  },
  {
    id: 4,
    name: "Important Links",
    description: "Manage essential academic portals and online resources",
    icon: Link,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    count: 15,
    category: "Academic"
  },
  {
    id: 5,
    name: "Important Contacts",
    description: "Manage faculty and administrative contact directory",
    icon: Users,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    count: 32,
    category: "Contacts"
  },
  {
    id: 6,
    name: "Grade Predictor",
    description: "Manage grade prediction tools and resources",
    icon: BarChart3,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    count: 5,
    category: "Academic"
  },
  {
    id: 7,
    name: "Grade Calculator",
    description: "Manage GPA and semester grade calculation tools",
    icon: Calculator,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50",
    count: 3,
    category: "Academic"
  },
  {
    id: 8,
    name: "Join WhatsApp Group",
    description: "Manage WhatsApp group links and community resources",
    icon: MessageCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    count: 6,
    category: "Community"
  }
];
*/

export default function ResourceHub() {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceCounts, setResourceCounts] = useState<{[key: string]: number}>({});
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ResourceCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<ResourceCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [selectedCategoryForResource, setSelectedCategoryForResource] = useState<string>('');
  const [resourceFormData, setResourceFormData] = useState({
    subcategory: '',
    description: '',
    externalLink: ''
  });
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isDeleteResourceDialogOpen, setIsDeleteResourceDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState<ResourceCategory | null>(null);

  // Fetch resources and categories from Firebase
  useEffect(() => {
    // Initialize categories on first load
    initializeCategories().catch(console.error);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allResources, allCategories, pyqs, notes, videos, contacts, links, books] = await Promise.all([
        resourceService.getAllResources(),
        resourceService.getAllCategories(),
        pyqService.getAllPYQs().catch(() => []),
        notesService.getAllNotes().catch(() => []),
        videoLectureService.getAllVideoLectures().catch(() => []),
        contactService.getAllContacts().catch(() => []),
        linkService.getAllLinks().catch(() => []),
        bookService.getAllBooks().catch(() => [])
      ]);
      
      setResources(allResources);
      setCategories(allCategories);
      
      // Calculate counts per category
      const counts: {[key: string]: number} = {};
      allCategories.forEach(category => {
        let count = 0;
        
        // Count based on category type
        switch (category.name) {
          case 'PYQs':
            count = pyqs.filter(p => p.status === 'published').length;
            break;
          case 'Notes':
            count = notes.filter(n => n.status === 'published').length;
            break;
          case 'Video Lectures':
            count = videos.filter(v => v.status === 'published').length;
            break;
          case 'Important Contacts':
            count = contacts.filter(c => c.status === 'active').length;
            break;
          case 'Important Links':
            count = links.filter(l => l.status === 'active').length;
            break;
          case 'Recommended Books':
            count = books.filter(b => b.status === 'published').length;
            break;
          default:
            // For other categories, count resources from resourceService
            count = allResources.filter(r => 
              r.category === category.name && r.status === 'published'
            ).length;
            break;
        }
        
        counts[category.name] = count;
      });
      setResourceCounts(counts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };



  // Helper functions to categorize different types
  const isBasicCategory = (categoryName: string) => {
    return ['Grade Predictor', 'Grade Calculator', 'Join WhatsApp Group', 'WhatsApp Groups', 'Join WhatsApp Groups'].includes(categoryName);
  };

  const isFullControlCategory = (categoryName: string) => {
    return ['Student Handbook', 'Grading Document', 'Important Contacts', 'PYQs', 'Notes', 'Video Lectures', 'Recommended Books'].includes(categoryName);
  };

  const isInternalCategory = (categoryName: string) => {
    return ['Important Links', 'Verify Certificate'].includes(categoryName);
  };



  const handleCategoryClick = (categoryName: string) => {
    // Basic categories - no click action
    if (isBasicCategory(categoryName)) {
      return;
    }
    
    // Full control categories that redirect to dedicated pages
    if (categoryName === 'Student Handbook' || categoryName === 'Grading Document') {
      window.location.href = `/resource-hub/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`;
      return;
    }
    
    // Full control categories that redirect to other admin pages
    if (categoryName === 'Important Links') {
      window.location.href = '/link-tree';
      return;
    }
    if (categoryName === 'Verify Certificate') {
      window.location.href = '/certificates';
      return;
    }
    
    // Full control categories with dedicated management pages
    if (categoryName === 'Important Contacts' || categoryName === 'PYQs' || categoryName === 'Notes' || categoryName === 'Video Lectures' || categoryName === 'Recommended Books') {
      window.location.href = `/resource-hub/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`;
      return;
    }
    
    // Other categories - redirect to management page
    if (!isBasicCategory(categoryName) && !isFullControlCategory(categoryName)) {
      window.location.href = `/resource-hub/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`;
      return;
    }
  };

  const handleDeleteResourceClick = (resource: Resource) => {
    setResourceToDelete(resource);
    setIsDeleteResourceDialogOpen(true);
  };

  const handleDeleteResourceConfirm = async () => {
    if (!resourceToDelete?.id) return;
    
    try {
      const resourceTitle = resourceToDelete.title;
      await resourceService.deleteResource(resourceToDelete.id);
      setIsDeleteResourceDialogOpen(false);
      setResourceToDelete(null);
      await fetchData();
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
      await fetchData();
      toast.success(newStatus === 'published' ? `${resource.title} is now visible` : `${resource.title} is now hidden`);
    } catch (error) {
      console.error('Error toggling resource status:', error);
      toast.error('Failed to update resource status');
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setSelectedCategoryForResource(resource.category);
    setResourceFormData({
      subcategory: resource.title,
      description: resource.description,
      externalLink: resource.fileUrl || ''
    });
    setIsResourceDialogOpen(true);
  };

  const handleEditCategory = (category: ResourceCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description
    });
    setIsCategoryDialogOpen(true);
  };

  const handleVisibilityClick = (category: ResourceCategory) => {
    setCategoryToToggle(category);
    setIsVisibilityDialogOpen(true);
  };

  const handleVisibilityConfirm = async () => {
    if (!categoryToToggle?.id) return;
    
    try {
      const newStatus = !categoryToToggle.isActive;
      await resourceService.updateCategory(categoryToToggle.id, {
        isActive: newStatus
      });
      setIsVisibilityDialogOpen(false);
      setCategoryToToggle(null);
      await fetchData();
      toast.success(newStatus ? `${categoryToToggle.name} is now visible on frontend` : `${categoryToToggle.name} is now hidden from frontend`);
    } catch (error) {
      console.error('Error toggling category visibility:', error);
      toast.error('Failed to update category visibility');
    }
  };

  const handleDeleteCategoryClick = (category: ResourceCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete?.id) return;
    
    try {
      const categoryName = categoryToDelete.name;
      await resourceService.deleteCategory(categoryToDelete.id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      await fetchData();
      toast.success(`${categoryName} deleted successfully`);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryFormData.name || !categoryFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingCategory?.id) {
        // Update existing category
        await resourceService.updateCategory(editingCategory.id, {
          name: categoryFormData.name,
          description: categoryFormData.description,
          updatedAt: new Date()
        });
        toast.success(`${categoryFormData.name} updated successfully`);
      } else {
        // Add new category
        const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;
        const autoIcon = getIconForCategory(categoryFormData.name);
        
        await resourceService.addCategory({
          name: categoryFormData.name,
          description: categoryFormData.description,
          icon: autoIcon.icon,
          iconColor: autoIcon.iconColor,
          bgColor: autoIcon.bgColor,
          order: maxOrder + 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success(`${categoryFormData.name} added successfully`);
      }
      
      setCategoryFormData({ name: '', description: '' });
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };



  const handleSaveResource = async () => {
    if (!resourceFormData.subcategory || !resourceFormData.description || !resourceFormData.externalLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingResource?.id) {
        await resourceService.updateResource(editingResource.id, {
          title: resourceFormData.subcategory,
          description: resourceFormData.description,
          fileUrl: resourceFormData.externalLink,
          updatedAt: new Date()
        });
        toast.success(`${resourceFormData.subcategory} updated successfully`);
      } else {
        await resourceService.addResource({
          title: resourceFormData.subcategory,
          description: resourceFormData.description,
          category: selectedCategoryForResource,
          fileUrl: resourceFormData.externalLink,
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success(`${resourceFormData.subcategory} added successfully`);
      }
      
      setResourceFormData({ subcategory: '', description: '', externalLink: '' });
      setEditingResource(null);
      setIsResourceDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
  };

  const getSubcategoryOptions = () => {
    if (selectedCategoryForResource === 'Student Handbook') {
      return ['DS Handbook', 'ES Handbook'];
    } else if (selectedCategoryForResource === 'Grading Document') {
      return ['DS Grading Doc', 'ES Grading Doc'];
    }
    // For other categories, return empty array (will use free text input)
    return [];
  };
  
  const isFixedSubcategory = selectedCategoryForResource === 'Student Handbook' || selectedCategoryForResource === 'Grading Document';

  const filteredResources = selectedCategory 
    ? resources.filter(r => r.category === selectedCategory)
    : resources;

  return (
    <PageLayout title="Resource Hub Management" subtitle="Manage documents, files, and resources" activeItem="Resource Hub" isLoading={loading}>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
            setIsCategoryDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              setCategoryFormData({ name: '', description: '' });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {editingCategory ? 'Edit Resource Category' : 'Add New Resource Category'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    Category Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter category description"
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory} className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category) => {
            // Override icon for Join WhatsApp Group category
            let IconComponent = iconMap[category.icon] || Book;
            let iconColor = category.iconColor;
            let bgColor = category.bgColor;
            
            if (category.name === 'Join WhatsApp Group' || category.name === 'WhatsApp Groups' || category.name === 'Join WhatsApp Groups') {
              console.log('WhatsApp category detected:', category.name);
              IconComponent = MessageCircle;
              iconColor = 'text-green-600';
              bgColor = 'bg-green-50';
            }
            
            const isBasic = isBasicCategory(category.name);
            const isFullControl = isFullControlCategory(category.name);
            const isInternal = isInternalCategory(category.name);
            
            return (
              <div 
                key={category.id} 
                className={`group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 min-h-[280px] sm:min-h-[300px] ${
                  isBasic 
                    ? 'opacity-90' 
                    : 'hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-1 cursor-pointer'
                } ${selectedCategory === category.name ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                onClick={isBasic ? undefined : () => handleCategoryClick(category.name)}
              >
                {/* Category Type Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium z-10 ${
                  isBasic ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 
                  isFullControl ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                  isInternal ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {isBasic ? 'Basic' : isFullControl ? 'Full Control' : isInternal ? 'Internal' : 'External'}
                </div>

                {/* Action Buttons - Always Visible */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisibilityClick(category);
                    }}
                    className={`p-1.5 rounded-md transition-colors shadow-sm ${
                      category.isActive 
                        ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50' 
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50'
                    }`}
                    title={category.isActive ? 'Visible on frontend' : 'Hidden from frontend'}
                  >
                    {category.isActive ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
                    title="Edit category"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategoryClick(category);
                    }}
                    className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors shadow-sm"
                    title="Delete category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-4 pt-10 sm:pt-12 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${category.name.toLowerCase().includes('whatsapp') ? 'bg-green-50' : bgColor} rounded-lg flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0`}>
                    {category.name.toLowerCase().includes('whatsapp') ? (
                      <MessageCircle className={`w-5 h-5 sm:w-6 sm:h-6 text-green-600`} />
                    ) : (
                      <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-2 line-clamp-2 leading-tight">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {category.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    {/* Item Count / Status */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      isBasic 
                        ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {isBasic ? 'Basic Card' : `${resourceCounts[category.name] || 0} items`}
                    </div>


                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Resource Dialog */}
        <Dialog open={isResourceDialogOpen} onOpenChange={(open) => {
          setIsResourceDialogOpen(open);
          if (!open) {
            setEditingResource(null);
            setResourceFormData({ subcategory: '', description: '', externalLink: '' });
          }
        }}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {editingResource ? 'Edit Resource' : `Add Resource to ${selectedCategoryForResource}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subcategory" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  {isFixedSubcategory ? 'Subcategory' : 'Title'} <span className="text-red-500">*</span>
                </Label>
                {isFixedSubcategory ? (
                  <Select value={resourceFormData.subcategory} onValueChange={(value) => setResourceFormData({ ...resourceFormData, subcategory: value })}>
                    <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoryOptions().map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="subcategory"
                    placeholder="Enter resource title"
                    value={resourceFormData.subcategory}
                    onChange={(e) => setResourceFormData({ ...resourceFormData, subcategory: e.target.value })}
                    className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  value={resourceFormData.description}
                  onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="externalLink" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  External Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="externalLink"
                  type="url"
                  placeholder="https://example.com"
                  value={resourceFormData.externalLink}
                  onChange={(e) => setResourceFormData({ ...resourceFormData, externalLink: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={handleSaveResource} className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm">
                {editingResource ? 'Update Resource' : 'Add Resource'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Delete Category
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Are you sure you want to delete <span className="font-semibold">{categoryToDelete?.name}</span>? 
                This action cannot be undone and will also delete all resources in this category.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={handleDeleteCategoryConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Visibility Toggle Confirmation Dialog */}
        <Dialog open={isVisibilityDialogOpen} onOpenChange={setIsVisibilityDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {categoryToToggle?.isActive ? 'Hide Category' : 'Show Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Are you sure you want to {categoryToToggle?.isActive ? 'hide' : 'show'} <span className="font-semibold">{categoryToToggle?.name}</span> {categoryToToggle?.isActive ? 'from' : 'on'} the frontend?
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsVisibilityDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={handleVisibilityConfirm} className={categoryToToggle?.isActive ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}>
                {categoryToToggle?.isActive ? 'Hide' : 'Show'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Resource Confirmation Dialog */}
        <Dialog open={isDeleteResourceDialogOpen} onOpenChange={setIsDeleteResourceDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Delete Resource
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Are you sure you want to delete <span className="font-semibold">{resourceToDelete?.title}</span>? 
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteResourceDialogOpen(false)} className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Cancel
              </Button>
              <Button onClick={handleDeleteResourceConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedCategory && (
          <Card className={`rounded-2xl shadow-sm border-0 ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedCategory} Resources
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                >
                  Clear Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading resources...</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No resources found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className={`flex items-center justify-between p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-4">
                        <FileText className={`w-8 h-8 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <div>
                          <h4 className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{resource.title}</h4>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {resource.clicks || 0} clicks
                            </span>
                            <Badge className={`${
                              resource.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {resource.status}
                            </Badge>
                            <span className={`${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>{resource.downloads || 0} downloads</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={resource.status === 'published' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                          title={resource.status === 'published' ? 'Hide' : 'Show'}
                          onClick={() => handleToggleResourceStatus(resource)}
                        >
                          {resource.status === 'published' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700" 
                          title="Edit"
                          onClick={() => handleEditResource(resource)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700" 
                          title="Delete"
                          onClick={() => handleDeleteResourceClick(resource)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
    </PageLayout>
  );
}
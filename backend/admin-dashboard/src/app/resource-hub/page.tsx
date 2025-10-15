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
import { Book, TrendingUp, FileText, Link, Users, MessageCircle, Calculator, BarChart3, GraduationCap, Newspaper, Video, Image as ImageIcon, Music, Code, Laptop, FlaskConical, Medal, Trophy, Award, ClipboardList, Plus, Edit, Trash2, Eye, Download } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { resourceService, Resource, ResourceCategory } from "@/lib/resourceService";
import { initializeCategories } from "@/lib/initializeCategories";

// Icon mapping
const iconMap: {[key: string]: any} = {
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

// Default categories for initialization
const defaultCategories = [
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

  // Fetch resources and categories from Firebase
  useEffect(() => {
    // Initialize categories on first load
    initializeCategories().catch(console.error);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allResources, allCategories] = await Promise.all([
        resourceService.getAllResources(),
        resourceService.getAllCategories()
      ]);
      
      setResources(allResources);
      setCategories(allCategories);
      
      // Calculate counts per category
      const counts: {[key: string]: number} = {};
      allCategories.forEach(category => {
        counts[category.name] = allResources.filter(r => r.category === category.name).length;
      });
      setResourceCounts(counts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Student Handbook' || categoryName === 'Grading Document') {
      setSelectedCategory(categoryName);
    } else {
      // Redirect to category-specific page
      window.location.href = `/resource-hub/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`;
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.deleteResource(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  const handleEditCategory = (category: ResourceCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description
    });
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteClick = (category: ResourceCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete?.id) return;
    
    try {
      await resourceService.deleteCategory(categoryToDelete.id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      await fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryFormData.name || !categoryFormData.description) {
      alert('Please fill in all required fields');
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
      }
      
      setCategoryFormData({ name: '', description: '' });
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleAddResourceClick = (categoryName: string) => {
    setSelectedCategoryForResource(categoryName);
    setResourceFormData({ subcategory: '', description: '', externalLink: '' });
    setIsResourceDialogOpen(true);
  };

  const handleSaveResource = async () => {
    if (!resourceFormData.subcategory || !resourceFormData.description || !resourceFormData.externalLink) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await resourceService.addResource({
        title: resourceFormData.subcategory,
        description: resourceFormData.description,
        category: selectedCategoryForResource,
        fileUrl: resourceFormData.externalLink,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setResourceFormData({ subcategory: '', description: '', externalLink: '' });
      setIsResourceDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource');
    }
  };

  const getSubcategoryOptions = () => {
    if (selectedCategoryForResource === 'Student Handbook') {
      return ['DS Handbook', 'ES Handbook'];
    } else if (selectedCategoryForResource === 'Grading Document') {
      return ['DS Grading Doc', 'ES Grading Doc'];
    }
    return [];
  };

  const filteredResources = selectedCategory 
    ? resources.filter(r => r.category === selectedCategory)
    : resources;

  return (
    <PageLayout title="Resource Hub" activeItem="Resource Hub">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Resource Management</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Manage documents, files, and resources</p>
          </div>
          <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
            setIsCategoryDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              setCategoryFormData({ name: '', description: '' });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
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
                <Button onClick={handleSaveCategory} className="bg-green-600 hover:bg-green-700 text-white">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Book;
            return (
              <Card 
                key={category.id} 
                className={`rounded-2xl shadow-sm border-0 transition-all hover:shadow-lg cursor-pointer relative overflow-hidden group ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } ${selectedCategory === category.name ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 ease-in-out rounded-2xl" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(category);
                        }}
                        className="text-red-600 hover:text-red-700"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{category.name}</h3>
                    <p className={`text-xs mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{category.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gray-100 text-gray-700">
                      {resourceCounts[category.name] || 0} items
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (category.name === 'Student Handbook' || category.name === 'Grading Document') {
                          handleAddResourceClick(category.name);
                        } else {
                          alert(`Add items to ${category.name} - Feature coming soon!`);
                        }
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Resource Dialog */}
        <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
          <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Add Resource to {selectedCategoryForResource}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subcategory" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Subcategory <span className="text-red-500">*</span>
                </Label>
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
              <Button onClick={handleSaveResource} className="bg-green-600 hover:bg-green-700 text-white">
                Add Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
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
              <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
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
                              {resource.fileType || 'PDF'} • {resource.fileSize || 'N/A'}
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
                        {resource.fileUrl && (
                          <Button variant="outline" size="sm" title="View" onClick={() => window.open(resource.fileUrl, '_blank')}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {resource.fileUrl && (
                          <Button variant="outline" size="sm" title="Download" onClick={() => window.open(resource.fileUrl, '_blank')}>
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700" 
                          title="Delete"
                          onClick={() => resource.id && handleDeleteResource(resource.id)}
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
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Plus, Edit, Trash2, Folder } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";

const resources = [
  {
    id: 1,
    title: "Brand Guidelines 2024",
    type: "PDF",
    category: "Branding",
    size: "2.4 MB",
    downloads: 156,
    status: "Published",
    lastModified: "2 days ago"
  },
  {
    id: 2,
    title: "Marketing Templates",
    type: "ZIP",
    category: "Marketing",
    size: "15.2 MB",
    downloads: 89,
    status: "Published",
    lastModified: "1 week ago"
  },
  {
    id: 3,
    title: "Employee Handbook",
    type: "PDF",
    category: "HR",
    size: "5.1 MB",
    downloads: 234,
    status: "Draft",
    lastModified: "3 days ago"
  }
];

const categories = [
  { name: "Branding", count: 12, color: "bg-blue-100 text-blue-700" },
  { name: "Marketing", count: 8, color: "bg-green-100 text-green-700" },
  { name: "HR", count: 15, color: "bg-purple-100 text-purple-700" },
  { name: "Legal", count: 6, color: "bg-red-100 text-red-700" }
];

export default function ResourceHub() {
  const { isDarkMode } = useTheme();

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
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Upload Resource
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-6 text-center">
                <Folder className={`w-8 h-8 mx-auto mb-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{category.name}</h3>
                <Badge className={`mt-2 ${category.color}`}>
                  {category.count} files
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Recent Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource) => (
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
                          {resource.type} • {resource.size}
                        </span>
                        <Badge className={`${
                          resource.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {resource.status}
                        </Badge>
                        <span className={`${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{resource.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
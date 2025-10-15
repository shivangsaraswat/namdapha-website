"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { resourceService, Resource } from "@/lib/resourceService";

export default function CategoryResourcePage() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const categorySlug = params.category as string;
  const categoryName = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [categoryName]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const allResources = await resourceService.getAllResources();
      const filtered = allResources.filter(r => r.category === categoryName);
      setResources(filtered);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.deleteResource(id);
        await fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  return (
    <PageLayout title={categoryName} activeItem="Resource Hub">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/resource-hub')}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resource Hub
            </Button>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>

        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {categoryName} Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No resources found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className={`flex items-center justify-between p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{resource.title}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {resource.description}
                          </span>
                          <Badge className={`${
                            resource.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {resource.status}
                          </Badge>
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
      </div>
    </PageLayout>
  );
}

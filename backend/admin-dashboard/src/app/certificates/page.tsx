"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Plus, Edit, Trash2, Download, Eye, Copy, Palette, Type, Image } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";

const certificates = [
  {
    id: 1,
    name: "Course Completion Certificate",
    template: "Modern Blue",
    issued: 245,
    status: "Active",
    lastModified: "2 days ago",
    preview: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "Achievement Award",
    template: "Golden Elite",
    issued: 89,
    status: "Active",
    lastModified: "1 week ago",
    preview: "/api/placeholder/300/200"
  },
  {
    id: 3,
    name: "Participation Certificate",
    template: "Simple Clean",
    issued: 156,
    status: "Draft",
    lastModified: "3 days ago",
    preview: "/api/placeholder/300/200"
  }
];

const templates = [
  { name: "Modern Blue", category: "Professional", preview: "/api/placeholder/150/100" },
  { name: "Golden Elite", category: "Premium", preview: "/api/placeholder/150/100" },
  { name: "Simple Clean", category: "Minimal", preview: "/api/placeholder/150/100" },
  { name: "Corporate", category: "Business", preview: "/api/placeholder/150/100" }
];

const stats = [
  { label: "Total Certificates", value: "12", change: "+3" },
  { label: "Issued This Month", value: "490", change: "+25%" },
  { label: "Active Templates", value: "8", change: "+2" },
  { label: "Download Rate", value: "94%", change: "+5%" }
];

export default function Certificates() {
  const { isDarkMode } = useTheme();

  return (
    <PageLayout title="Certificates" activeItem="Certificates">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Certificate Management</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Create, customize, and manage digital certificates</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Palette className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Certificate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stat.value}</p>
                  </div>
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Your Certificates</CardTitle>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className={`w-32 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <div className={`w-20 h-14 rounded-lg flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-500' : 'bg-gray-200'
                      }`}>
                        <Award className={`w-8 h-8 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{cert.name}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Template: {cert.template}</span>
                          <Badge className={`${
                            cert.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {cert.status}
                          </Badge>
                          <span className={`${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{cert.issued} issued</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
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

          <div>
            <Card className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Certificate Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Certificate Name</label>
                  <Input 
                    placeholder="Enter certificate name" 
                    className={`mt-1 ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-200'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Template</label>
                  <Select>
                    <SelectTrigger className={`mt-1 ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.name} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Type className="w-4 h-4 mr-2" />
                    Customize Text
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-2" />
                    Add Logo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="w-4 h-4 mr-2" />
                    Colors & Fonts
                  </Button>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Create Certificate
                </Button>
              </CardContent>
            </Card>

            <Card className={`rounded-2xl shadow-sm border-0 mt-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Course Completion Certificate issued to 15 users</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>New template "Golden Elite" created</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Achievement Award template updated</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
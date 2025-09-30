"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, ExternalLink, Plus, Edit, Trash2, Eye, BarChart3 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  {
    id: 1,
    title: "Official Website",
    url: "https://example.com",
    clicks: 1250,
    status: "Active",
    category: "Main",
    lastClicked: "2 hours ago"
  },
  {
    id: 2,
    title: "Social Media",
    url: "https://twitter.com/example",
    clicks: 890,
    status: "Active",
    category: "Social",
    lastClicked: "5 hours ago"
  },
  {
    id: 3,
    title: "Contact Form",
    url: "https://example.com/contact",
    clicks: 456,
    status: "Inactive",
    category: "Contact",
    lastClicked: "1 day ago"
  },
  {
    id: 4,
    title: "Newsletter Signup",
    url: "https://example.com/newsletter",
    clicks: 234,
    status: "Active",
    category: "Marketing",
    lastClicked: "3 hours ago"
  }
];

const stats = [
  { label: "Total Links", value: "24", change: "+3" },
  { label: "Total Clicks", value: "12.5K", change: "+15%" },
  { label: "Active Links", value: "18", change: "+2" },
  { label: "Avg. CTR", value: "3.2%", change: "+0.5%" }
];

export default function LinkTree() {
  const { isDarkMode } = useTheme();

  return (
    <PageLayout title="Link Tree" activeItem="Link Tree">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Link Management</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Manage your link tree and track performance</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
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

        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Your Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-4">
                    <Link className={`w-8 h-8 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{link.title}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{link.url}</span>
                        <Badge className={`${
                          link.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {link.status}
                        </Badge>
                        <span className={`${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{link.clicks} clicks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
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

        <Card className={`rounded-2xl shadow-sm border-0 ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Eye className="w-6 h-6 mb-2" />
                Preview Link Tree
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ExternalLink className="w-6 h-6 mb-2" />
                Share Link Tree
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
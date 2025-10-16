"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users2, Plus, Edit, Trash2, UserPlus, Settings } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";

const teams = [
  {
    id: 1,
    name: "Development Team",
    description: "Frontend and backend development",
    members: 8,
    lead: "John Smith",
    status: "Active",
    project: "Website Redesign",
    avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32", "/api/placeholder/32/32"]
  },
  {
    id: 2,
    name: "Design Team",
    description: "UI/UX design and branding",
    members: 5,
    lead: "Alice Johnson",
    status: "Active",
    project: "Mobile App",
    avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32"]
  },
  {
    id: 3,
    name: "Marketing Team",
    description: "Digital marketing and content",
    members: 6,
    lead: "Bob Wilson",
    status: "Active",
    project: "Campaign 2024",
    avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32", "/api/placeholder/32/32"]
  },
  {
    id: 4,
    name: "QA Team",
    description: "Quality assurance and testing",
    members: 4,
    lead: "Carol Davis",
    status: "Inactive",
    project: "Testing Suite",
    avatars: ["/api/placeholder/32/32", "/api/placeholder/32/32"]
  }
];

const teamStats = [
  { label: "Total Teams", value: "12", change: "+2" },
  { label: "Active Members", value: "48", change: "+5" },
  { label: "Projects", value: "8", change: "+1" },
  { label: "Completion Rate", value: "94%", change: "+3%" }
];

export default function Teams() {
  const { isDarkMode } = useTheme();

  return (
    <PageLayout title="Teams Management" subtitle="Manage teams, members, and projects" activeItem="Teams">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {teamStats.map((stat) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{team.name}</CardTitle>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{team.description}</p>
                    <Badge className={`mt-2 ${
                      team.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {team.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className={`w-4 h-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{team.members} members</span>
                  </div>
                  <div className="flex -space-x-2">
                    {team.avatars.map((avatar, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members > 3 && (
                      <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium ${
                        isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}>
                        +{team.members - 3}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Team Lead: {team.lead}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Current Project: {team.project}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
            }`}>Team Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Development Team completed Website Redesign milestone</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>2 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>New member Sarah added to Design Team</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>4 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Marketing Team started Campaign 2024 project</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>1 day ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
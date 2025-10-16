"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";

const events = [
  {
    id: 1,
    title: "Annual Conference 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Convention Center",
    attendees: 250,
    status: "Published",
    type: "Conference"
  },
  {
    id: 2,
    title: "Workshop: Digital Marketing",
    date: "March 20, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Room 101",
    attendees: 45,
    status: "Draft",
    type: "Workshop"
  },
  {
    id: 3,
    title: "Networking Meetup",
    date: "March 25, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Rooftop Lounge",
    attendees: 80,
    status: "Published",
    type: "Meetup"
  }
];

export default function Events() {
  const { isDarkMode } = useTheme();

  return (
    <PageLayout title="Events Management" subtitle="Create and manage your events" activeItem="Events">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className={`rounded-2xl shadow-sm border-0 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{event.title}</CardTitle>
                    <Badge className={`mt-2 ${
                      event.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{event.attendees} attendees</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {event.type}
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
            }`}>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Annual Conference 2024 published</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>2 hours ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>New registration for Workshop</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>4 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
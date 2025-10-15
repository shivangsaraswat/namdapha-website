"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Search, TrendingDown, TrendingUp, ChevronRight, Users, Wallet } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import AuthGuard from "@/components/AuthGuard";

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
  { name: "Jun", value: 239 },
  { name: "Jul", value: 349 },
];

export default function Dashboard() {
  const { isDarkMode } = useTheme();

  return (
    <AuthGuard requiredPermission="dashboard">
      <div className={`min-h-screen font-sans ${
        isDarkMode ? 'bg-gray-800' : 'bg-[#F8F8F8]'
      }`}>
      <div className="flex">
        <Sidebar activeItem="Dashboard" />

        {/* Main Content */}
        <div className="flex-1 ml-60 p-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search anything..." 
                  className={`pl-10 w-80 rounded-lg h-10 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                      : 'bg-white border-gray-200'
                  }`}
                />
              </div>
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 h-10">
                Create
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-orange-400 text-white text-xs">U</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Overview Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Overview</h2>
                  <Select defaultValue="month">
                    <SelectTrigger className={`w-32 rounded-lg h-9 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Last month</SelectItem>
                      <SelectItem value="week">Last week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className={`rounded-2xl shadow-sm border-0 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className={`w-4 h-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Customers</span>
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>1,293</div>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        <span className="text-red-500 font-medium">36.8%</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={`rounded-2xl shadow-sm border-0 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Wallet className={`w-4 h-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Balance</span>
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>256k</div>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-green-500 font-medium">36.8%</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* New Customers */}
                <Card className={`rounded-2xl shadow-sm border-0 mb-6 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className={`text-lg font-semibold mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>857 new customers today!</div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Send a welcome message to all new customers.</div>
                      </div>
                      <Button variant="ghost" className={`text-sm ${
                        isDarkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}>
                        View all <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      {[
                        { name: "Gladyce", initial: "G" },
                        { name: "Elbert", initial: "E" },
                        { name: "Dash", initial: "D" },
                        { name: "Joyce", initial: "J" },
                        { name: "Marina", initial: "M" }
                      ].map((customer, i) => (
                        <div key={i} className="text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{customer.initial}</span>
                          </div>
                          <div className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{customer.name}</div>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className={`w-10 h-10 rounded-full ${
                        isDarkMode 
                          ? 'bg-gray-600 hover:bg-gray-500' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Product View Chart */}
              <Card className={`rounded-2xl shadow-sm border-0 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Product view</CardTitle>
                  <Select defaultValue="7days">
                    <SelectTrigger className={`w-32 rounded-lg h-9 ${
                      isDarkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <div className={`absolute top-4 left-4 text-6xl font-bold z-0 select-none ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-100'
                  }`}>$10.2m</div>
                  <div className="relative z-10 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
                        />
                        <YAxis hide />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              return (
                                <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                                  2.2m
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill={isDarkMode ? "#4B5563" : "#E5E7EB"}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              {/* Popular Products */}
              <Card className={`rounded-2xl shadow-sm border-0 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Popular products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {[
                    { name: "Crypter - NFT UI Kit", price: "$3,250.00", status: "Active", color: "bg-green-100" },
                    { name: "Bento Pro 2.0 Illustrations", price: "$7,890.00", status: "Active", color: "bg-blue-100" },
                    { name: "Fleet - travel shopping kit", price: "$1,500.00", status: "Offline", color: "bg-orange-100" },
                    { name: "SimpleSocial UI Design Kit", price: "$9,999.99", status: "Active", color: "bg-green-200" },
                    { name: "Bento Pro vol. 2", price: "$4,750.00", status: "Active", color: "bg-pink-100" },
                  ].map((product, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${product.color} rounded-lg flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{product.name}</div>
                        <div className={`text-sm font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{product.price}</div>
                      </div>
                      <Badge 
                        className={`text-xs font-medium px-2 py-1 ${
                          product.status === "Active" 
                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {product.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="ghost" className={`w-full text-sm mt-4 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                    All products
                  </Button>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card className={`rounded-2xl shadow-sm border-0 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              }`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-700">J</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Joyce</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>on</span>
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Bento Pro 2.0</span>
                      </div>
                      <div className={`text-xs mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>09:00 AM</div>
                      <div className={`text-sm leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Great work! When HTML version will be available?
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-purple-700">G</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Gladyce</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>on</span>
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Food Delivery App</span>
                      </div>
                      <div className={`text-xs mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>08:45 AM</div>
                      <div className={`text-sm leading-relaxed ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Love the design system!
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
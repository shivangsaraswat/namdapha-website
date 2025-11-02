"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText, Plus, Edit, Trash2, Eye, Share2, BarChart3, Settings, MousePointer, Type, CheckSquare } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Form name is required"),
  type: z.string().min(1, "Form type is required"),
});

const forms = [
  {
    id: 1,
    name: "Event Registration Form",
    type: "Registration",
    responses: 342,
    status: "Published",
    lastModified: "2 hours ago",
    conversionRate: "85%"
  },
  {
    id: 2,
    name: "Feedback Survey",
    type: "Survey",
    responses: 156,
    status: "Published",
    lastModified: "1 day ago",
    conversionRate: "72%"
  },
  {
    id: 3,
    name: "Contact Us Form",
    type: "Contact",
    responses: 89,
    status: "Draft",
    lastModified: "3 days ago",
    conversionRate: "0%"
  },
  {
    id: 4,
    name: "Newsletter Signup",
    type: "Subscription",
    responses: 234,
    status: "Published",
    lastModified: "1 week ago",
    conversionRate: "91%"
  }
];

const formElements = [
  { name: "Text Input", icon: Type, description: "Single line text field" },
  { name: "Multiple Choice", icon: CheckSquare, description: "Radio buttons or checkboxes" },
  { name: "Dropdown", icon: MousePointer, description: "Select from options" },
  { name: "Text Area", icon: FileText, description: "Multi-line text input" }
];

const stats = [
  { label: "Total Forms", value: "18", change: "+4" },
  { label: "Total Responses", value: "2.1K", change: "+18%" },
  { label: "Published Forms", value: "12", change: "+2" },
  { label: "Avg. Completion", value: "78%", change: "+6%" }
];

export default function Forms() {
  const { isDarkMode } = useTheme();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <PageLayout title="Forms" activeItem="Forms">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Form Management</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Create, customize, and publish interactive forms</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Form
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
                  }`}>Your Forms</CardTitle>
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
                        <SelectItem value="all">All Forms</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div key={form.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-500' : 'bg-gray-200'
                      }`}>
                        <FileText className={`w-6 h-6 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{form.name}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{form.type}</span>
                          <Badge className={`${
                            form.status === 'Published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {form.status}
                          </Badge>
                          <span className={`${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{form.responses} responses</span>
                          <span className="text-emerald-600 font-medium">{form.conversionRate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
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
                }`}>Form Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Form Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter form name" 
                              className={isDarkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-200'
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Form Type
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={isDarkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-200'
                              }>
                                <SelectValue placeholder="Choose type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="registration">Registration</SelectItem>
                              <SelectItem value="survey">Survey</SelectItem>
                              <SelectItem value="contact">Contact</SelectItem>
                              <SelectItem value="subscription">Subscription</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <label className={`text-sm font-medium mb-2 block ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Form Elements</label>
                      <div className="space-y-2">
                        {formElements.map((element) => {
                          const Icon = element.icon;
                          return (
                            <Button 
                              key={element.name}
                              type="button"
                              variant="outline" 
                              className="w-full justify-start h-auto p-3"
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              <div className="text-left">
                                <div className="font-medium">{element.name}</div>
                                <div className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>{element.description}</div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Start Building
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className={`rounded-2xl shadow-sm border-0 mt-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Forms
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Form Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { eventService, Event } from "@/lib/eventService";
import { uploadImage } from "@/lib/cloudinary";
import { toast } from "sonner";
import Image from "next/image";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC } from 'react';

const categories = ['Paradox', 'Workshops', 'Meetups', 'Other Events'] as const;

interface SortableRowProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (event: Event) => void;
}

const SortableRow: FC<SortableRowProps> = ({ event, onEdit, onDelete, onToggleStatus }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: event.id! });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </TableCell>
      <TableCell>
        <Image src={event.imageUrl} alt={event.title} width={60} height={60} className="rounded-lg object-cover" />
      </TableCell>
      <TableCell className="font-medium">{event.title}</TableCell>
      <TableCell>{event.date}</TableCell>
      <TableCell>
        <Badge className={event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
          {event.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onToggleStatus(event)}>
            {event.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(event.id!)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function Events() {
  const { isDarkMode } = useTheme();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'upcoming' | 'past'>('upcoming');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Event['category'] | '',
    date: '',
    time: '',
    venue: '',
    meetLink: '',
    imageUrl: ''
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [upcoming, past] = await Promise.all([
        eventService.getUpcomingEvents(),
        eventService.getPastEvents()
      ]);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    const checkExpiredEvents = async () => {
      const now = new Date();
      for (const event of upcomingEvents) {
        const eventDateTime = new Date(`${event.date}T${event.time || '23:59'}`);
        if (eventDateTime < now) {
          await eventService.moveToType(event.id!, 'past');
          toast.info(`${event.title} moved to past events`);
          fetchEvents();
        }
      }
    };
    
    const interval = setInterval(checkExpiredEvents, 60000);
    return () => clearInterval(interval);
  }, [upcomingEvents]);

  const handleAddClick = (type: 'upcoming' | 'past') => {
    setDialogType(type);
    setEditingEvent(null);
    setFormData({ title: '', description: '', category: '', date: '', time: '', venue: '', meetLink: '', imageUrl: '' });
    setIsDialogOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setDialogType(event.type);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time || '',
      venue: event.venue || '',
      meetLink: event.meetLink || '',
      imageUrl: event.imageUrl
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadImage(file, 'events');
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.date || !formData.imageUrl) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const events = dialogType === 'upcoming' ? upcomingEvents : pastEvents;
      const maxOrder = events.length > 0 ? Math.max(...events.map(e => e.order)) : 0;

      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id!, {
          ...formData,
          category: formData.category as Event['category'],
          updatedAt: new Date()
        });
        toast.success('Event updated');
      } else {
        await eventService.addEvent({
          ...formData,
          category: formData.category as Event['category'],
          type: dialogType,
          order: maxOrder + 1,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success('Event added');
      }

      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted');
      setDeleteConfirm(null);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleToggleStatus = async (event: Event) => {
    try {
      await eventService.updateEvent(event.id!, {
        status: event.status === 'active' ? 'inactive' : 'active'
      });
      toast.success(`Event ${event.status === 'active' ? 'hidden' : 'shown'}`);
      fetchEvents();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDragEnd = async (event: DragEndEvent, type: 'upcoming' | 'past') => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const items = type === 'upcoming' ? upcomingEvents : pastEvents;
    const oldIndex = items.findIndex(e => e.id === active.id);
    const newIndex = items.findIndex(e => e.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    if (type === 'upcoming') {
      setUpcomingEvents(reordered);
    } else {
      setPastEvents(reordered);
    }

    try {
      await eventService.reorderEvents(reordered.map((e, i) => ({ id: e.id!, order: i })));
      toast.success('Order updated');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to update order');
      fetchEvents();
    }
  };



  const groupedPastEvents = categories.reduce((acc, cat) => {
    acc[cat] = pastEvents.filter(e => e.category === cat);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <PageLayout title="Events Management" subtitle="Manage upcoming and past events" activeItem="Events">
      <div className="space-y-8">
        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Events</h3>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAddClick('upcoming')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Upcoming Event
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : upcomingEvents.length === 0 ? (
            <Card className={`p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No upcoming events</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {upcomingEvents.map(event => (
                <Card key={event.id} className={`rounded-xl shadow-sm border-0 overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className="relative w-full aspect-[3/4]">
                    <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className={event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <h3 className={`font-semibold text-sm line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="line-clamp-1">{event.date} • {event.time}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 pt-1">
                      <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => handleToggleStatus(event)}>
                        {event.status === 'active' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => handleEditClick(event)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-7" onClick={() => setDeleteConfirm(event.id!)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Past Events</h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAddClick('past')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Past Event
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : pastEvents.length === 0 ? (
            <Card className={`p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No past events</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {categories.map(cat => {
                const events = groupedPastEvents[cat];
                if (events.length === 0) return null;
                return (
                  <div key={cat}>
                    <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cat}</h4>
                    <Card className={isDarkMode ? 'bg-gray-700' : 'bg-white'}>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'past')}>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12"></TableHead>
                              <TableHead>Poster</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <SortableContext items={events.map(e => e.id!)} strategy={verticalListSortingStrategy}>
                            <TableBody>
                              {events.map(event => (
                                <SortableRow
                                  key={event.id}
                                  event={event}
                                  onEdit={handleEditClick}
                                  onDelete={setDeleteConfirm}
                                  onToggleStatus={handleToggleStatus}
                                />
                              ))}
                            </TableBody>
                          </SortableContext>
                        </Table>
                      </DndContext>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} max-w-2xl max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit' : 'Add'} {dialogType === 'upcoming' ? 'Upcoming' : 'Past'} Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
            </div>
            <div className="space-y-2">
              <Label>Description <span className="text-red-500">*</span></Label>
              <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
            </div>
            <div className="space-y-2">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val as Event['category'] }))}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date <span className="text-red-500">*</span></Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
              </div>
              {dialogType === 'upcoming' && (
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={formData.time} onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
                </div>
              )}
            </div>
            {dialogType === 'upcoming' && (
              <>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Input value={formData.venue} onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
                </div>
                <div className="space-y-2">
                  <Label>Google Meet Link</Label>
                  <Input value={formData.meetLink} onChange={(e) => setFormData(prev => ({ ...prev, meetLink: e.target.value }))} placeholder="meet.google.com/xxx-xxxx-xxx" className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Poster <span className="text-red-500">*</span></Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={uploading} className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''} />
              {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
              {formData.imageUrl && <Image src={formData.imageUrl} alt="Preview" width={200} height={150} className="rounded-lg" />}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={uploading}>{editingEvent ? 'Update' : 'Add'} Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
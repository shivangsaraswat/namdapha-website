"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { bookService, Book } from "@/lib/bookService";
import { toast } from "sonner";

export default function BooksManagement() {
  const { isDarkMode } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    subject: '',
    level: '',
    imageUrl: '',
    buyLink: ''
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await bookService.getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddClick = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      description: '',
      author: '',
      subject: '',
      level: '',
      imageUrl: '',
      buyLink: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      author: book.author,
      subject: book.subject,
      level: book.level,
      imageUrl: book.imageUrl,
      buyLink: book.buyLink || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete?.id) return;
    
    try {
      await bookService.deleteBook(bookToDelete.id);
      setIsDeleteDialogOpen(false);
      setBookToDelete(null);
      await fetchBooks();
      toast.success(`${bookToDelete.title} deleted successfully`);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const handleToggleStatus = async (book: Book) => {
    try {
      const newStatus = book.status === 'published' ? 'draft' : 'published';
      await bookService.updateBook(book.id!, { status: newStatus });
      await fetchBooks();
      toast.success(newStatus === 'published' ? `${book.title} is now visible` : `${book.title} is now hidden`);
    } catch (error) {
      console.error('Error toggling book status:', error);
      toast.error('Failed to update book status');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.subject || !formData.level || !formData.imageUrl) {
      toast.error('Please fill in all required fields (Title, Description, Subject, Level, Image URL)');
      return;
    }

    try {
      if (editingBook?.id) {
        await bookService.updateBook(editingBook.id, {
          ...formData,
          updatedAt: new Date()
        });
        toast.success(`${formData.title} updated successfully`);
      } else {
        await bookService.addBook({
          ...formData,
          status: 'published',
          views: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        toast.success(`${formData.title} added successfully`);
      }
      
      setIsDialogOpen(false);
      setEditingBook(null);
      await fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Failed to save book');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Resource Hub
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      <Card className={`rounded-lg shadow-sm border-0 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <CardContent className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading books...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-8">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No books found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {books.map((book) => (
                <div key={book.id} className={`rounded-md border p-2 transition-all hover:shadow-sm ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="aspect-[3/4] mb-2 rounded overflow-hidden bg-gray-200 relative">
                    <Image 
                      src={book.imageUrl} 
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-medium text-xs line-clamp-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {book.title}
                    </h3>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="secondary" className={`text-xs px-1 py-0 ${book.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {book.status}
                      </Badge>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {book.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 pt-1">
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(book)} className={`h-6 w-6 p-0 ${book.status === 'published' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}>
                        <Eye className="w-2.5 h-2.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(book)} className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700">
                        <Edit className="w-2.5 h-2.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteClick(book)} className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Book Title *</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Author</Label>
              <Input 
                value={formData.author} 
                onChange={(e) => setFormData({...formData, author: e.target.value})} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Subject *</Label>
              <Input 
                value={formData.subject} 
                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Level *</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="BSc">BSc</SelectItem>
                  <SelectItem value="BS">BS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Description *</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3} 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Book Cover Image URL *</Label>
              <Input 
                value={formData.imageUrl} 
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="https://example.com/book-cover.jpg" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Buy Link (Optional)</Label>
              <Input 
                value={formData.buyLink} 
                onChange={(e) => setFormData({...formData, buyLink: e.target.value})} 
                placeholder="https://amazon.com/book-link" 
                className={isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <span className="font-semibold">{bookToDelete?.title}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
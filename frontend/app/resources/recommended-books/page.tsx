"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { BookOpen, ExternalLink, User, ChevronDown, ChevronUp } from "lucide-react";
import { bookService, Book } from "@/lib/bookService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  const [expandState, setExpandState] = useState<'collapsed' | 'partial' | 'full'>('collapsed');
  
  const PREVIEW_LENGTH = 150;
  const PARTIAL_LENGTH = 500;
  
  const isLongDescription = book.description.length > PREVIEW_LENGTH;
  const isVeryLongDescription = book.description.length > PARTIAL_LENGTH;
  
  const getDisplayText = () => {
    if (expandState === 'collapsed') {
      return book.description.substring(0, PREVIEW_LENGTH);
    } else if (expandState === 'partial') {
      return book.description.substring(0, PARTIAL_LENGTH);
    }
    return book.description;
  };
  
  const handleToggle = () => {
    if (expandState === 'collapsed') {
      setExpandState(isVeryLongDescription ? 'partial' : 'full');
    } else if (expandState === 'partial') {
      setExpandState('full');
    } else {
      setExpandState('collapsed');
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 hover:border-orange-400 transition-all duration-300 overflow-hidden">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex p-4 gap-3">
          {/* Left: Poster */}
          <div className="w-24 h-32 flex-shrink-0 relative bg-gray-50 rounded">
            <Image 
              src={book.imageUrl} 
              alt={book.title}
              fill
              className="object-cover rounded"
              unoptimized
            />
            {book.level && (
              <div className="absolute -top-1 -left-1 bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
                {book.level}
              </div>
            )}
          </div>
          
          {/* Right: Title, Author, Subject, Buy Link */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm text-gray-900 leading-tight flex-1 mr-2">
                {book.title}
              </h3>
              {book.buyLink && (
                <a 
                  href={book.buyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => book.id && bookService.incrementViews(book.id)}
                  className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0"
                >
                  <span>Get Book</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            
            <div className="space-y-2">
              {book.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{book.author}</span>
                </div>
              )}
              {book.subject && (
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {book.subject}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Description below spanning full width */}
        <div className="px-4 pb-4">
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="whitespace-pre-wrap">
              {getDisplayText()}
              {expandState === 'collapsed' && isLongDescription && '...'}
            </p>
            {isLongDescription && (
              <button 
                onClick={handleToggle}
                className="text-orange-500 hover:text-orange-600 text-xs font-medium flex items-center gap-1 mt-2"
              >
                {expandState === 'collapsed' ? (
                  <>Read more <ChevronDown className="w-3 h-3" /></>
                ) : expandState === 'partial' && isVeryLongDescription ? (
                  <>Show more <ChevronDown className="w-3 h-3" /></>
                ) : (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        <div className="w-48 h-72 flex-shrink-0 relative bg-gray-50">
          <Image 
            src={book.imageUrl} 
            alt={book.title}
            fill
            className="object-cover"
            unoptimized
          />
          {book.level && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {book.level}
            </div>
          )}
        </div>

        <div className="flex-1 p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
            {book.title}
          </h3>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2 items-start">
              {book.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">{book.author}</span>
                </div>
              )}
              
              {book.subject && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {book.subject}
                </span>
              )}
            </div>
            
            {book.buyLink && (
              <a 
                href={book.buyLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => book.id && bookService.incrementViews(book.id)}
                className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
              >
                <span>Get Book</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="whitespace-pre-wrap">
              {getDisplayText()}
              {expandState === 'collapsed' && isLongDescription && '...'}
            </p>
            {isLongDescription && (
              <button 
                onClick={handleToggle}
                className="text-orange-500 hover:text-orange-600 text-xs font-medium flex items-center gap-1 mt-2"
              >
                {expandState === 'collapsed' ? (
                  <>Read more <ChevronDown className="w-3 h-3" /></>
                ) : expandState === 'partial' && isVeryLongDescription ? (
                  <>Show more <ChevronDown className="w-3 h-3" /></>
                ) : (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendedBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const fetchedBooks = await bookService.getPublishedBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching books:', error);
        }
        setBooks([{
          id: 'fallback-1',
          title: 'Introduction to Computer Science',
          description: 'A comprehensive guide covering fundamental concepts in computer science. This book provides detailed explanations of algorithms, data structures, programming paradigms, and software engineering principles. Perfect for students beginning their journey in computer science.',
          author: 'Academic Team',
          subject: 'Computer Science',
          level: 'Beginner',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
          buyLink: '#',
          status: 'published' as const,
          views: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const levels = ["All", ...Array.from(new Set(books.map(book => book.level)))];
  const subjects = ["All", ...Array.from(new Set(books.map(book => book.subject)))];

  const filteredBooks = books.filter(book => {
    const levelMatch = selectedLevel === "All" || book.level === selectedLevel;
    const subjectMatch = selectedSubject === "All" || book.subject === selectedSubject;
    return levelMatch && subjectMatch;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <div className="container relative mx-auto h-full max-w-[1200px]">
          <Image
            src="/bg.svg"
            alt="Background pattern"
            width={672}
            height={326}
            className="absolute right-0 top-0 opacity-10 md:-right-8 md:-top-1.5"
            priority
          />
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/bg.svg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 py-12 px-6 md:px-8 lg:px-12 pt-28">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Recommended Books
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Discover curated books recommended by faculty and students to enhance your learning journey
            </p>
          </div>
        </div>
      </section>

      <main className="relative pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Level:</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px] bg-white border-gray-300">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Subject:</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[160px] bg-white border-gray-300">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {filteredBooks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No books found matching your criteria</p>
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { DataCache } from './cache';

export interface Book {
  id?: string;
  title: string;
  description: string;
  author: string;
  subject: string;
  level: string;
  imageUrl: string;
  buyLink?: string;
  status: 'published' | 'draft';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'recommendedBooks';

export const bookService = {
  // Get all published books
  async getPublishedBooks(): Promise<Book[]> {
    const cached = DataCache.get<Book[]>('books_published');
    if (cached) return cached;

    const q = query(
      collection(db, COLLECTION_NAME), 
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt?.toDate() || new Date(),
        updatedAt: docData.updatedAt?.toDate() || new Date()
      } as Book;
    });
    
    DataCache.set('books_published', data, 30);
    return data;
  },

  // Get all books (for admin)
  async getAllBooks(): Promise<Book[]> {
    const cached = DataCache.get<Book[]>('books_all');
    if (cached) return cached;

    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt?.toDate() || new Date(),
        updatedAt: docData.updatedAt?.toDate() || new Date()
      } as Book;
    });
    
    DataCache.set('books_all', data, 30);
    return data;
  },

  // Get books by subject
  async getBooksBySubject(subject: string): Promise<Book[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('subject', '==', subject),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Book));
  },

  // Get books by level
  async getBooksByLevel(level: string): Promise<Book[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('level', '==', level),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Book));
  },

  // Add new book
  async addBook(book: Omit<Book, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    });
    DataCache.clear('books_all');
    DataCache.clear('books_published');
    return docRef.id;
  },

  // Update book
  async updateBook(id: string, book: Partial<Book>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...book,
      updatedAt: new Date()
    });
    DataCache.clear('books_all');
    DataCache.clear('books_published');
  },

  // Delete book
  async deleteBook(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    DataCache.clear('books_all');
    DataCache.clear('books_published');
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const booksSnapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
    const bookDoc = booksSnapshot.docs.find(d => d.id === id);
    if (bookDoc) {
      const currentViews = bookDoc.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1
      });
    }
  }
};
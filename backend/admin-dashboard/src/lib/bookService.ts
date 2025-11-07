import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

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
  async getAllBooks(): Promise<Book[]> {
    const booksRef = collection(db, COLLECTION_NAME);
    const q = query(booksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Book));
  },

  async addBook(book: Omit<Book, 'id'>): Promise<string> {
    const booksRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(booksRef, {
      ...book,
      createdAt: Timestamp.fromDate(book.createdAt),
      updatedAt: Timestamp.fromDate(book.updatedAt),
    });
    return docRef.id;
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<void> {
    const bookRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
    }
    await updateDoc(bookRef, updateData);
  },

  async deleteBook(id: string): Promise<void> {
    const bookRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(bookRef);
  },

  async incrementViews(id: string): Promise<void> {
    const bookRef = doc(db, COLLECTION_NAME, id);
    const books = await this.getAllBooks();
    const book = books.find(b => b.id === id);
    if (book) {
      await updateDoc(bookRef, {
        views: (book.views || 0) + 1
      });
    }
  },
};
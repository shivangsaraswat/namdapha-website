import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export interface Note {
  id?: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  year: string;
  fileUrl: string;
  fileType: 'link' | 'upload';
  status: 'published' | 'draft';
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'notes';

export const notesService = {
  async getAllNotes(): Promise<Note[]> {
    const notesRef = collection(db, COLLECTION_NAME);
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Note));
  },

  async addNote(note: Omit<Note, 'id'>): Promise<string> {
    const notesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(notesRef, {
      ...note,
      createdAt: Timestamp.fromDate(note.createdAt),
      updatedAt: Timestamp.fromDate(note.updatedAt),
    });
    return docRef.id;
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    const noteRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
    }
    await updateDoc(noteRef, updateData);
  },

  async deleteNote(id: string): Promise<void> {
    const noteRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(noteRef);
  },
};

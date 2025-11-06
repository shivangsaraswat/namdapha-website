import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { DataCache } from './cache';

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
  // Get published notes only
  async getPublishedNotes(): Promise<Note[]> {
    const cached = DataCache.get<Note[]>('notes_published');
    if (cached) return cached;

    const notesRef = collection(db, COLLECTION_NAME);
    const q = query(notesRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Note));
    const data = notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    DataCache.set('notes_published', data, 30);
    return data;
  },

  // Increment downloads
  async incrementDownloads(id: string): Promise<void> {
    const noteRef = doc(db, COLLECTION_NAME, id);
    const notes = await this.getPublishedNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateDoc(noteRef, {
        downloads: (note.downloads || 0) + 1,
      });
    }
  },
};

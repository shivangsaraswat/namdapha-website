import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

export interface PYQ {
  id?: string;
  subject: string;
  level: string;
  term: string;
  semester: string;
  year: string;
  fileUrl: string;
  fileType: 'link' | 'upload';
  status: 'published' | 'draft';
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'pyqs';

export const pyqService = {
  // Get all PYQs
  async getAllPYQs(): Promise<PYQ[]> {
    const pyqsRef = collection(db, COLLECTION_NAME);
    const q = query(pyqsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as PYQ));
  },

  // Get published PYQs only
  async getPublishedPYQs(): Promise<PYQ[]> {
    const pyqsRef = collection(db, COLLECTION_NAME);
    const q = query(pyqsRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    const pyqs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as PYQ));
    return pyqs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Add new PYQ
  async addPYQ(pyq: Omit<PYQ, 'id'>): Promise<string> {
    const pyqsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(pyqsRef, {
      ...pyq,
      createdAt: Timestamp.fromDate(pyq.createdAt),
      updatedAt: Timestamp.fromDate(pyq.updatedAt),
    });
    return docRef.id;
  },

  // Update PYQ
  async updatePYQ(id: string, updates: Partial<PYQ>): Promise<void> {
    const pyqRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
    }
    await updateDoc(pyqRef, updateData);
  },

  // Delete PYQ
  async deletePYQ(id: string): Promise<void> {
    const pyqRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(pyqRef);
  },

  // Increment downloads
  async incrementDownloads(id: string): Promise<void> {
    const pyqRef = doc(db, COLLECTION_NAME, id);
    const pyqs = await this.getAllPYQs();
    const pyq = pyqs.find(p => p.id === id);
    if (pyq) {
      await updateDoc(pyqRef, {
        downloads: (pyq.downloads || 0) + 1,
      });
    }
  },
};

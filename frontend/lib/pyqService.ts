import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { DataCache } from './cache';

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
  // Get published PYQs only
  async getPublishedPYQs(): Promise<PYQ[]> {
    const cached = DataCache.get<PYQ[]>('pyqs_published');
    if (cached) return cached;

    const pyqsRef = collection(db, COLLECTION_NAME);
    const q = query(pyqsRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    const pyqs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as PYQ));
    const data = pyqs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    DataCache.set('pyqs_published', data, 5);
    return data;
  },

  // Increment downloads
  async incrementDownloads(id: string): Promise<void> {
    const pyqRef = doc(db, COLLECTION_NAME, id);
    const pyqs = await this.getPublishedPYQs();
    const pyq = pyqs.find(p => p.id === id);
    if (pyq) {
      await updateDoc(pyqRef, {
        downloads: (pyq.downloads || 0) + 1,
      });
    }
  },
};

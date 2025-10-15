import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, query, where, increment } from 'firebase/firestore';

export interface Link {
  id?: string;
  title: string;
  url: string;
  category: string;
  type: 'social' | 'important';
  platform?: string;
  clicks?: number;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'links';

export const linkService = {
  // Get active links by type
  async getActiveLinksByType(type: 'social' | 'important'): Promise<Link[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('type', '==', type),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Link))
      .sort((a, b) => a.order - b.order);
  },

  // Increment click count
  async incrementClicks(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });
  }
};

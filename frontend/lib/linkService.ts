import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, query, where, increment } from 'firebase/firestore';
import { DataCache } from './cache';

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
    const cacheKey = `links_${type}_active`;
    const cached = DataCache.get<Link[]>(cacheKey);
    if (cached) return cached;

    const q = query(
      collection(db, COLLECTION_NAME), 
      where('type', '==', type),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Link))
      .sort((a, b) => a.order - b.order);
    
    DataCache.set(cacheKey, data, 60);
    return data;
  },

  // Increment click count
  async incrementClicks(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });
  }
};

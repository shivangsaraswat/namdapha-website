import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, increment } from 'firebase/firestore';

export interface Link {
  id?: string;
  title: string;
  url: string;
  category: string;
  type: 'social' | 'important';
  platform?: string; // For social media: instagram, youtube, whatsapp, linkedin, twitter, facebook
  clicks?: number;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'links';

export const linkService = {
  // Get all links
  async getAllLinks(): Promise<Link[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Link));
  },

  // Get links by type
  async getLinksByType(type: 'social' | 'important'): Promise<Link[]> {
    const q = query(collection(db, COLLECTION_NAME), where('type', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Link))
      .sort((a, b) => a.order - b.order);
  },

  // Get active links
  async getActiveLinks(): Promise<Link[]> {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Link))
      .sort((a, b) => a.order - b.order);
  },

  // Add new link
  async addLink(link: Omit<Link, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...link,
      createdAt: new Date(),
      updatedAt: new Date(),
      clicks: 0
    });
    return docRef.id;
  },

  // Update link
  async updateLink(id: string, link: Partial<Link>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...link,
      updatedAt: new Date()
    });
  },

  // Delete link
  async deleteLink(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  // Increment click count
  async incrementClicks(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });
  }
};

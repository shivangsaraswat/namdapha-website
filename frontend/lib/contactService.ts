import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { DataCache } from './cache';

export interface Contact {
  id?: string;
  name: string;
  role: string;
  email: string;

  photoUrl?: string;
  description?: string;
  type: 'leadership' | 'other';
  status: 'active' | 'inactive';
  order: number;
}

const COLLECTION_NAME = 'contacts';

export const contactService = {
  async getActiveContacts(): Promise<Contact[]> {
    const cached = DataCache.get<Contact[]>('contacts_active');
    if (cached) return cached;

    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
    const data = contacts.sort((a, b) => a.order - b.order);
    
    DataCache.set('contacts_active', data, 10);
    return data;
  }
};

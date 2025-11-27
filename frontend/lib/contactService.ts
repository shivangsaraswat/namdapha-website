import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';


export interface Contact {
  id?: string;
  name: string;
  role: string;
  email: string;
  photoUrl?: string;
  description?: string;
  category: 'leadership' | 'pods' | 'sec' | 'paradox' | 'placement' | 'others';
  status: 'active' | 'inactive';
  order: number;
}

const COLLECTION_NAME = 'contacts';

export const contactService = {
  async getActiveContacts(): Promise<Contact[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    const contacts = snapshot.docs.map(doc => {
      const rawData = doc.data();
      const data = { 
        id: doc.id, 
        ...rawData,
        category: (rawData as Record<string, unknown>).category || (rawData as Record<string, unknown>).type
      } as Contact;
      return data;
    });
    return contacts.sort((a, b) => a.order - b.order);
  }
};

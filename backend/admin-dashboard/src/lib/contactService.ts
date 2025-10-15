import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

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
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'contacts';

export const contactService = {
  async getAllContacts(): Promise<Contact[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
    return contacts.sort((a, b) => a.order - b.order);
  },

  async addContact(contact: Omit<Contact, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), contact);
    return docRef.id;
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<void> {
    await updateDoc(doc(db, COLLECTION_NAME, id), updates);
  },

  async deleteContact(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};

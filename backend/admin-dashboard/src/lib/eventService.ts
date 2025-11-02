import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export interface Event {
  id?: string;
  title: string;
  description: string;
  category: 'Paradox' | 'Workshops' | 'Meetups' | 'Other Events';
  date: string;
  time?: string;
  venue?: string;
  meetLink?: string;
  imageUrl: string;
  type: 'upcoming' | 'past';
  order: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'events';

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Event)).sort((a, b) => a.order - b.order);
  },

  async getUpcomingEvents(): Promise<Event[]> {
    const q = query(collection(db, COLLECTION_NAME), where('type', '==', 'upcoming'), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Event)).sort((a, b) => a.order - b.order);
  },

  async getPastEvents(): Promise<Event[]> {
    const q = query(collection(db, COLLECTION_NAME), where('type', '==', 'past'), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Event)).sort((a, b) => a.order - b.order);
  },

  async addEvent(event: Omit<Event, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...event,
      createdAt: Timestamp.fromDate(event.createdAt),
      updatedAt: Timestamp.fromDate(event.updatedAt),
    });
    return docRef.id;
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
    }
    await updateDoc(docRef, updateData);
  },

  async deleteEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  async reorderEvents(events: { id: string; order: number }[]): Promise<void> {
    const updates = events.map(({ id, order }) => 
      updateDoc(doc(db, COLLECTION_NAME, id), { order })
    );
    await Promise.all(updates);
  },

  async moveToType(id: string, type: 'upcoming' | 'past'): Promise<void> {
    await updateDoc(doc(db, COLLECTION_NAME, id), { 
      type,
      updatedAt: Timestamp.now()
    });
  }
};

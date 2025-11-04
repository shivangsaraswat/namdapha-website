import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';

export interface Activity {
  id?: string;
  name: string;
  description: string;
  logo: string;
  poster: string;
  category: string;
  registrationLink?: string;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'activities';

export const activitiesService = {
  async getAllActivities(): Promise<Activity[]> {
    const activitiesRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(activitiesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Activity)).sort((a, b) => a.order - b.order);
  },

  async getVisibleActivities(): Promise<Activity[]> {
    const activitiesRef = collection(db, COLLECTION_NAME);
    const q = query(activitiesRef, where('isVisible', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Activity)).sort((a, b) => a.order - b.order);
  },

  async addActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const activitiesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(activitiesRef, {
      ...activity,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async updateActivity(id: string, activity: Partial<Activity>): Promise<void> {
    const activityRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(activityRef, {
      ...activity,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteActivity(id: string): Promise<void> {
    const activityRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(activityRef);
  },
};

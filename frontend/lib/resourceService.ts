import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

export interface Resource {
  id?: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  downloads?: number;
  clicks?: number;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceCategory {
  id?: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'resources';
const CATEGORIES_COLLECTION = 'resourceCategories';

export const resourceService = {
  // Get all resources
  async getAllResources(): Promise<Resource[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Resource));
  },

  // Get resources by category
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Resource));
  },

  // Get published resources only
  async getPublishedResources(): Promise<Resource[]> {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Resource));
  },

  // Add new resource
  async addResource(resource: Omit<Resource, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...resource,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0,
      clicks: 0
    });
    return docRef.id;
  },

  // Increment click count
  async incrementClicks(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const resourceSnapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
    const resourceDoc = resourceSnapshot.docs.find(d => d.id === id);
    if (resourceDoc) {
      const currentClicks = resourceDoc.data().clicks || 0;
      await updateDoc(docRef, {
        clicks: currentClicks + 1
      });
    }
  },

  // Update resource
  async updateResource(id: string, resource: Partial<Resource>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...resource,
      updatedAt: new Date()
    });
  },

  // Delete resource
  async deleteResource(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },



  // Category Management
  async getAllCategories(): Promise<ResourceCategory[]> {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ResourceCategory))
      .sort((a, b) => a.order - b.order);
  },

  async getActiveCategories(): Promise<ResourceCategory[]> {
    const q = query(collection(db, CATEGORIES_COLLECTION), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ResourceCategory))
      .sort((a, b) => a.order - b.order);
  },

  async addCategory(category: Omit<ResourceCategory, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  },

  async updateCategory(id: string, category: Partial<ResourceCategory>): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: new Date()
    });
  },

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
  }
};

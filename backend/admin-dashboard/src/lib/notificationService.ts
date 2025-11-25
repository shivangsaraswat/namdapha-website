import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'announcement' | 'warning' | 'success';
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  actionButton?: {
    text: string;
    url: string;
    style: 'primary' | 'secondary';
  };
  imageUrl?: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: 'info' | 'announcement' | 'warning' | 'success';
  priority: number;
  expiresAt?: Date;
  actionButton?: {
    text: string;
    url: string;
    style: 'primary' | 'secondary';
  };
  imageUrl?: string;
}

export interface UpdateNotificationData extends Partial<CreateNotificationData> {
  isActive?: boolean;
}

export const notificationService = {
  async getAllNotifications(): Promise<Notification[]> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
      })) as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async createNotification(data: CreateNotificationData): Promise<string> {
    try {
      const notificationsRef = collection(db, 'notifications');

      // Filter out undefined values to prevent Firestore errors
      const cleanData: Record<string, unknown> = {
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: data.expiresAt ? Timestamp.fromDate(data.expiresAt) : null,
      };

      // Only add optional fields if they have values
      if (data.actionButton) {
        cleanData.actionButton = data.actionButton;
      }
      if (data.imageUrl) {
        cleanData.imageUrl = data.imageUrl;
      }

      const docRef = await addDoc(notificationsRef, cleanData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async updateNotification(id: string, data: UpdateNotificationData): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', id);

      // Filter out undefined values to prevent Firestore errors
      const cleanData: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
        expiresAt: data.expiresAt ? Timestamp.fromDate(data.expiresAt) : null,
      };

      // Only add defined fields
      if (data.title !== undefined) cleanData.title = data.title;
      if (data.message !== undefined) cleanData.message = data.message;
      if (data.type !== undefined) cleanData.type = data.type;
      if (data.priority !== undefined) cleanData.priority = data.priority;
      if (data.isActive !== undefined) cleanData.isActive = data.isActive;
      if (data.actionButton !== undefined) cleanData.actionButton = data.actionButton;
      if (data.imageUrl !== undefined) cleanData.imageUrl = data.imageUrl;

      await updateDoc(notificationRef, cleanData);
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  async deleteNotification(id: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', id);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  async toggleNotificationStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', id);
      await updateDoc(notificationRef, {
        isActive,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling notification status:', error);
      throw error;
    }
  }
};
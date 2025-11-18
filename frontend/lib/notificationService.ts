import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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

export const notificationService = {
  async getActiveNotifications(): Promise<Notification[]> {
    try {
      const notificationsRef = collection(db, 'notifications');
      
      // Try indexed query first, fallback to simple query if index is building
      let snapshot;
      try {
        const q = query(
          notificationsRef,
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
        snapshot = await getDocs(q);
      } catch {
        // Fallback: get all notifications and filter client-side
        const simpleQuery = query(notificationsRef, where('isActive', '==', true));
        snapshot = await getDocs(simpleQuery);
      }
      
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
      })) as Notification[];

      // Filter out expired notifications and sort by priority and date
      const now = new Date();
      return notifications
        .filter(notification => 
          !notification.expiresAt || notification.expiresAt > now
        )
        .sort((a, b) => {
          // Sort by priority first, then by creation date
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
};
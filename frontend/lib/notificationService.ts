import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, orderBy, Timestamp, deleteDoc } from 'firebase/firestore';

export interface Notification {
  id?: string;
  userId: string;
  type: 'follow_request' | 'follow_accepted' | 'like' | 'comment' | 'mention';
  fromUserId: string;
  fromUserName: string;
  fromUserImage?: string;
  fromUserSlug?: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string;
}

const NOTIFICATIONS_COLLECTION = 'communityNotifications';

export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<string> {
    const data: any = {
      userId: notification.userId,
      type: notification.type,
      fromUserId: notification.fromUserId,
      fromUserName: notification.fromUserName,
      message: notification.message,
      read: false,
      createdAt: Timestamp.now()
    };
    if (notification.fromUserImage) data.fromUserImage = notification.fromUserImage;
    if (notification.fromUserSlug) data.fromUserSlug = notification.fromUserSlug;
    if (notification.relatedId) data.relatedId = notification.relatedId;
    
    const notifRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), data);
    return notifRef.id;
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      } as Notification));
    } catch (error) {
      console.warn('Index building, returning empty notifications');
      return [];
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.warn('Index building, returning 0 unread count');
      return 0;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), { read: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      const updates = snapshot.docs.map(doc => updateDoc(doc.ref, { read: true }));
      await Promise.all(updates);
    } catch (error) {
      console.warn('Index building, cannot mark all as read yet');
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
  }
};

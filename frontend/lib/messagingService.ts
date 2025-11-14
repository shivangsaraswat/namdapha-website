import { db } from './firebase';
import { collection, doc, addDoc, getDocs, query, where, orderBy, limit, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';

export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: { [userId: string]: number };
}

const MESSAGES_COLLECTION = 'communityMessages';
const CONVERSATIONS_COLLECTION = 'communityConversations';

export const messagingService = {
  async getOrCreateConversation(user1: string, user2: string): Promise<string> {
    const participants = [user1, user2].sort();
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', '==', participants),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    
    const convRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
      participants,
      lastMessage: '',
      lastMessageAt: Timestamp.now(),
      unreadCount: { [user1]: 0, [user2]: 0 }
    });
    return convRef.id;
  },

  async sendMessage(conversationId: string, senderId: string, receiverId: string, content: string): Promise<string> {
    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
      conversationId,
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: Timestamp.now()
    });
    
    await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
      lastMessage: content,
      lastMessageAt: Timestamp.now(),
      [`unreadCount.${receiverId}`]: (await this.getUnreadCount(conversationId, receiverId)) + 1
    });
    
    return messageRef.id;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Message));
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const q = query(
      collection(db, CONVERSATIONS_COLLECTION),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastMessageAt: doc.data().lastMessageAt?.toDate()
    } as Conversation));
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
      [`unreadCount.${userId}`]: 0
    });
  },

  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    const convDoc = await getDocs(query(collection(db, CONVERSATIONS_COLLECTION), where('__name__', '==', conversationId)));
    if (convDoc.empty) return 0;
    return convDoc.docs[0].data().unreadCount?.[userId] || 0;
  },

  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      } as Message));
      callback(messages);
    });
  }
};

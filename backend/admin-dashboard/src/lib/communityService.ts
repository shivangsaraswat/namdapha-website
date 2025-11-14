import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export interface CommunityUser {
  id?: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  status: 'active' | 'suspended' | 'deactivated' | 'deleted';
  role: 'member' | 'moderator';
  createdAt: Date;
  lastActive: Date;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

const USERS_COLLECTION = 'communityUsers';

export const communityService = {
  async getAllUsers(): Promise<CommunityUser[]> {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    } as CommunityUser));
  },

  async updateUserStatus(userId: string, status: CommunityUser['status']): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, userId), { status });
  }
};

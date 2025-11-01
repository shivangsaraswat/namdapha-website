import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DataCache } from './cache';

export interface CouncilMember {
  id: string;
  name: string;
  position: string;
  type: 'leadership' | 'coordinator';
  imageUrl?: string;
  isVisible: boolean;
  createdAt?: Date;
}

const COLLECTION_NAME = 'council';

export const councilService = {
  async getVisibleMembers(): Promise<CouncilMember[]> {
    const cached = DataCache.get<CouncilMember[]>('council_visible');
    if (cached) return cached;

    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const members = snapshot.docs.map(doc => {
      const data = doc.data();

      let imageUrl: string | undefined = undefined;
      if (typeof data.imageUrl === 'string' && data.imageUrl.trim() !== '') {
        imageUrl = data.imageUrl.trim();
      } else if (data.imageUrl && typeof data.imageUrl === 'object') {
        imageUrl = data.imageUrl.url || data.imageUrl.secure_url || data.imageUrl.path || data.imageUrl.downloadURL || undefined;
        if (typeof imageUrl === 'string') imageUrl = imageUrl.trim();
      }

      return {
        id: doc.id,
        ...data,
        imageUrl,
        createdAt: data.createdAt?.toDate() || new Date()
      } as CouncilMember;
    }).filter(m => m.isVisible);

    DataCache.set('council_visible', members, 60);
    return members;
  },

  async getLeadership(): Promise<CouncilMember[]> {
    const members = await this.getVisibleMembers();
    return members.filter(m => m.type === 'leadership');
  },

  async getCoordinators(): Promise<CouncilMember[]> {
    const members = await this.getVisibleMembers();
    return members.filter(m => m.type === 'coordinator');
  }
};

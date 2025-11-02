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
  order?: number;
  createdAt?: Date;
}

const COLLECTION_NAME = 'council';
const CACHE_KEY = 'council_visible';
const CACHE_TTL_MINUTES = 2; // Cache for 2 minutes only

export const councilService = {
  async getVisibleMembers(forceRefresh: boolean = false): Promise<CouncilMember[]> {
    if (forceRefresh) {
      DataCache.clear(CACHE_KEY);
    }

    const cached = DataCache.get<CouncilMember[]>(CACHE_KEY);
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
    })
    .filter(m => m.isVisible)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

    DataCache.set(CACHE_KEY, members, CACHE_TTL_MINUTES);
    return members;
  },

  async getLeadership(forceRefresh: boolean = false): Promise<CouncilMember[]> {
    const members = await this.getVisibleMembers(forceRefresh);
    return members.filter(m => m.type === 'leadership');
  },

  async getCoordinators(forceRefresh: boolean = false): Promise<CouncilMember[]> {
    const members = await this.getVisibleMembers(forceRefresh);
    return members.filter(m => m.type === 'coordinator');
  },

  clearCache(): void {
    DataCache.clear(CACHE_KEY);
  }
};

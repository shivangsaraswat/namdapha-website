import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { DataCache } from './cache';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: 'webops' | 'multimedia' | 'outreach';
  imageUrl?: string;
  isVisible: boolean;
  order: number;
  createdAt?: Date;
}

const COLLECTION_NAME = 'teams';

export const teamService = {
  async getVisibleMembers(): Promise<TeamMember[]> {
    const q = query(collection(db, COLLECTION_NAME), where('isVisible', '==', true));
    const snapshot = await getDocs(q);
    
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
      } as TeamMember;
    }).sort((a, b) => a.order - b.order);

    if (members.length > 0) {
      DataCache.set('teams_visible', members, 60);
    }
    return members;
  },

  async getMembersByCategory(category: 'webops' | 'multimedia' | 'outreach'): Promise<TeamMember[]> {
    const members = await this.getVisibleMembers();
    return members.filter(m => m.category === category);
  }
};

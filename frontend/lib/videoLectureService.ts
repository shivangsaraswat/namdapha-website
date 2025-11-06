import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { DataCache } from './cache';

export interface VideoLecture {
  id?: string;
  title: string;
  description: string;
  level: string;
  subject: string;
  videoUrl: string;
  videoType: 'youtube' | 'playlist' | 'other';
  thumbnailUrl?: string;
  instructor?: string;
  duration?: string;
  status: 'published' | 'draft';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'videoLectures';

export const videoLectureService = {
  async getPublishedVideoLectures(): Promise<VideoLecture[]> {
    const cached = DataCache.get<VideoLecture[]>('videos_published');
    if (cached) return cached;

    const videosRef = collection(db, COLLECTION_NAME);
    const q = query(videosRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as VideoLecture));
    const data = videos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    DataCache.set('videos_published', data, 30);
    return data;
  },

  async incrementViews(id: string): Promise<void> {
    const videoRef = doc(db, COLLECTION_NAME, id);
    const videos = await this.getPublishedVideoLectures();
    const video = videos.find(v => v.id === id);
    if (video) {
      await updateDoc(videoRef, {
        views: (video.views || 0) + 1,
      });
    }
  },
};

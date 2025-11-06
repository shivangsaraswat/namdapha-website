import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

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
  async getAllVideoLectures(): Promise<VideoLecture[]> {
    const videosRef = collection(db, COLLECTION_NAME);
    const q = query(videosRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as VideoLecture));
  },

  async addVideoLecture(video: Omit<VideoLecture, 'id'>): Promise<string> {
    const videosRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(videosRef, {
      ...video,
      createdAt: Timestamp.fromDate(video.createdAt),
      updatedAt: Timestamp.fromDate(video.updatedAt),
    });
    return docRef.id;
  },

  async updateVideoLecture(id: string, updates: Partial<VideoLecture>): Promise<void> {
    const videoRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
    }
    await updateDoc(videoRef, updateData);
  },

  async deleteVideoLecture(id: string): Promise<void> {
    const videoRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(videoRef);
  },
};

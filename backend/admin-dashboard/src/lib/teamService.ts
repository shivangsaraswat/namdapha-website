import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { uploadImage, deleteImage } from './imagekit';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: 'webops' | 'multimedia' | 'outreach';
  imageUrl?: string | { url?: string; secure_url?: string; downloadURL?: string; path?: string };
  isVisible: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'teams';

export async function getTeamMembers(): Promise<TeamMember[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate()
  } as TeamMember));
}

export async function saveTeamMember(member: Omit<TeamMember, 'id'>, imageFile?: File): Promise<string> {
  let imageUrl = member.imageUrl;

  if (imageFile) {
    const result = await uploadImage(imageFile, 'teams');
    imageUrl = result.url;
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...member,
    imageUrl,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  return docRef.id;
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>, imageFile?: File): Promise<void> {
  let imageUrl = updates.imageUrl;

  if (imageFile) {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const currentMember = snapshot.docs.find(d => d.id === id)?.data();
    
    if (currentMember?.imageUrl && typeof currentMember.imageUrl === 'string') {
      try {
        await deleteImage(currentMember.imageUrl);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
    
    const result = await uploadImage(imageFile, 'teams');
    imageUrl = result.url;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...updates,
    ...(imageUrl && { imageUrl }),
    updatedAt: Timestamp.now()
  });
}

export async function deleteTeamMember(id: string): Promise<void> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  const currentMember = snapshot.docs.find(d => d.id === id)?.data();
  
  if (currentMember?.imageUrl && typeof currentMember.imageUrl === 'string') {
    try {
      await deleteImage(currentMember.imageUrl);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
  
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function reorderTeamMembers(members: { id: string; order: number }[]): Promise<void> {
  try {
    const updates = members.map(({ id, order }) => 
      updateDoc(doc(db, COLLECTION_NAME, id), { order })
    );
    await Promise.all(updates);
  } catch (error) {
    console.error('Error reordering members:', error);
    throw error;
  }
}

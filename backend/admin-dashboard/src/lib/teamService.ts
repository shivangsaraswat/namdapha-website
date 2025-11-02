import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

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
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    imageUrl = data.url;
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
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    imageUrl = data.url;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...updates,
    ...(imageUrl && { imageUrl }),
    updatedAt: Timestamp.now()
  });
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

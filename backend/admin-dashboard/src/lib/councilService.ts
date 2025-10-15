import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { uploadImage, deleteImage } from './cloudinary';

export interface CouncilMember {
  id: string;
  name: string;
  position: string;
  type: 'leadership' | 'coordinator';
  imageUrl?: string;
  isVisible: boolean;
  createdAt: Date;
}

export async function saveCouncilMember(member: Omit<CouncilMember, 'id' | 'createdAt'>, imageFile?: File) {
  const docRef = doc(collection(db, 'council'));
  
  let imageUrl = member.imageUrl;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile, 'council');
  }
  
  await setDoc(docRef, {
    ...member,
    imageUrl,
    id: docRef.id,
    createdAt: new Date()
  });
  return docRef.id;
}

export async function getCouncilMembers(): Promise<CouncilMember[]> {
  const snapshot = await getDocs(collection(db, 'council'));
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as CouncilMember[];
}

export async function updateCouncilMember(id: string, updates: Partial<CouncilMember>, imageFile?: File) {
  try {
    let imageUrl = updates.imageUrl;
    
    // If new image is uploaded, delete old image and upload new one
    if (imageFile) {
      // Get current member data to find old image
      const memberDoc = await getDocs(collection(db, 'council'));
      const currentMember = memberDoc.docs.find(doc => doc.id === id)?.data();
      
      // Delete old image if exists
      if (currentMember?.imageUrl) {
        try {
          await deleteImage(currentMember.imageUrl);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      // Upload new image
      imageUrl = await uploadImage(imageFile, 'council');
    }
    
    await updateDoc(doc(db, 'council', id), {
      ...updates,
      ...(imageUrl && { imageUrl })
    });
  } catch (error) {
    console.error('Error in updateCouncilMember:', error);
    throw error;
  }
}

export async function deleteCouncilMember(id: string) {
  try {
    // Get member data to find image URL
    const memberDoc = await getDocs(collection(db, 'council'));
    const currentMember = memberDoc.docs.find(doc => doc.id === id)?.data();
    
    // Delete image from Cloudinary if exists
    if (currentMember?.imageUrl) {
      try {
        await deleteImage(currentMember.imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    // Delete document from Firestore
    await deleteDoc(doc(db, 'council', id));
  } catch (error) {
    console.error('Error in deleteCouncilMember:', error);
    throw error;
  }
}
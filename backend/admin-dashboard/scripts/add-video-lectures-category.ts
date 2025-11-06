import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  // Add your Firebase config here from .env.local
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addVideoLecturesCategory() {
  try {
    const categoriesRef = collection(db, 'resourceCategories');
    
    const videoLecturesCategory = {
      name: 'Video Lectures',
      description: 'Access comprehensive video lectures and playlists',
      icon: 'FaVideo',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      order: 100,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(categoriesRef, videoLecturesCategory);
    console.log('✅ Video Lectures category added successfully with ID:', docRef.id);
  } catch (error) {
    console.error('❌ Error adding category:', error);
  }
}

addVideoLecturesCategory();

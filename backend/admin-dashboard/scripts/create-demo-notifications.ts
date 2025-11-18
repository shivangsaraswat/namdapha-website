import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const demoNotifications = [
  {
    title: "🎉 Welcome to Namdapha House!",
    message: "Join our vibrant community of 5000+ students at IIT Madras BS Degree program. Explore events, resources, and connect with fellow students.",
    type: "announcement",
    priority: 3,
    isActive: true,
  },
  {
    title: "📚 New Study Resources Available",
    message: "We've added new study materials and previous year questions to help you excel in your academics. Check out the Resource Hub now!",
    type: "info",
    priority: 2,
    isActive: true,
  },
  {
    title: "🏆 Upcoming Tech Fest 2024",
    message: "Get ready for our biggest tech fest! Registration opens soon. Stay tuned for exciting competitions, workshops, and prizes.",
    type: "success",
    priority: 3,
    isActive: false, // Inactive for testing
  },
  {
    title: "⚠️ Maintenance Notice",
    message: "The website will undergo scheduled maintenance on Sunday, 2 AM - 4 AM IST. Some features may be temporarily unavailable.",
    type: "warning",
    priority: 2,
    isActive: false, // Inactive for testing
  }
];

async function createDemoNotifications() {
  try {
    console.log('Creating demo notifications...');
    
    for (const notification of demoNotifications) {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Created notification: ${notification.title} (ID: ${docRef.id})`);
    }
    
    console.log('✅ Demo notifications created successfully!');
    console.log('\nTo test the system:');
    console.log('1. Visit the frontend website to see active notifications');
    console.log('2. Go to admin dashboard /notifications to manage them');
    console.log('3. Toggle active/inactive status to test visibility');
    
  } catch (error) {
    console.error('❌ Error creating demo notifications:', error);
  }
}

createDemoNotifications();
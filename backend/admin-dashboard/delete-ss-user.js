const { initializeApp } = require('firebase/app');
const { getFirestore, doc, deleteDoc } = require('firebase/firestore');

// Firebase configuration - make sure this matches your project
const firebaseConfig = {
  // Add your Firebase config here
  // You can find this in your Firebase project settings
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteSSUser() {
  try {
    // Delete the user with email "ss@gmail.com" from Firestore
    await deleteDoc(doc(db, 'users', 'ss@gmail.com'));
    console.log('✅ Successfully deleted SS user (ss@gmail.com) from database');
  } catch (error) {
    console.error('❌ Error deleting SS user:', error);
  }
}

// Run the deletion
deleteSSUser();
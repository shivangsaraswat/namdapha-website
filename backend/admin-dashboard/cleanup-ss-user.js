// Run this script to permanently remove SS user
// Execute: node cleanup-ss-user.js

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to add your service account key)
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupSSUser() {
  try {
    // Delete from Firestore
    await db.collection('users').doc('ss@gmail.com').delete();
    console.log('✅ SS user deleted from Firestore');
    
    // Also delete from Firebase Auth if exists
    try {
      const userRecord = await admin.auth().getUserByEmail('ss@gmail.com');
      await admin.auth().deleteUser(userRecord.uid);
      console.log('✅ SS user deleted from Firebase Auth');
    } catch (authError) {
      console.log('ℹ️ SS user not found in Firebase Auth (already deleted or never existed)');
    }
    
    console.log('🎉 SS user cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupSSUser();
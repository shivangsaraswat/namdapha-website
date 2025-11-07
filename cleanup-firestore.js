// Run this with: node cleanup-firestore.js
// Make sure to install: npm install firebase-admin

const admin = require('firebase-admin');

// Initialize with your service account
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'namdapha-website'
});

const db = admin.firestore();

async function deleteCollection(collectionPath, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function cleanup() {
  console.log('Starting Firestore cleanup...');
  
  try {
    console.log('Deleting posts collection...');
    await deleteCollection('posts');
    console.log('✓ Posts deleted');

    console.log('Deleting users collection...');
    await deleteCollection('users');
    console.log('✓ Users deleted');

    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();

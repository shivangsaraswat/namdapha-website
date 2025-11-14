const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fixUserStats() {
  try {
    const usersRef = db.collection('communityUsers');
    const snapshot = await usersRef.get();
    
    console.log(`Found ${snapshot.size} users to check`);
    
    let fixed = 0;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const stats = data.stats || {};
      
      const needsUpdate = 
        stats.followers === undefined || 
        stats.following === undefined || 
        stats.posts === undefined ||
        stats.profileViews === undefined ||
        stats.postImpressions === undefined;
      
      if (needsUpdate) {
        await doc.ref.update({
          'stats.followers': stats.followers || 0,
          'stats.following': stats.following || 0,
          'stats.posts': stats.posts || 0,
          'stats.profileViews': stats.profileViews || 0,
          'stats.postImpressions': stats.postImpressions || 0
        });
        fixed++;
        console.log(`Fixed stats for user: ${data.email}`);
      }
    }
    
    console.log(`\nFixed ${fixed} users`);
  } catch (error) {
    console.error('Error fixing user stats:', error);
  } finally {
    process.exit();
  }
}

fixUserStats();

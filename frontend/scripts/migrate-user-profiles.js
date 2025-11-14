// Database Migration Script for LinkedIn-Style Community Redesign
// Run this script to update existing user profiles with new fields

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration (replace with your credentials)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateUserProfiles() {
  console.log('🚀 Starting user profile migration...');

  try {
    const usersRef = collection(db, 'communityUsers');
    const snapshot = await getDocs(usersRef);

    console.log(`📊 Found ${snapshot.size} users to migrate`);

    let successCount = 0;
    let errorCount = 0;

    for (const userDoc of snapshot.docs) {
      try {
        const userData = userDoc.data();
        const updates = {};

        // Add new fields if they don't exist
        if (!userData.headline) {
          updates.headline = '';
        }

        if (!userData.bio) {
          updates.bio = '';
        }

        if (!userData.location) {
          updates.location = '';
        }

        if (!userData.website) {
          updates.website = '';
        }

        if (!userData.resume) {
          updates.resume = '';
        }

        if (!userData.hobbies) {
          updates.hobbies = [];
        }

        if (!userData.coverImage) {
          updates.coverImage = '';
        }

        // Add new stats if they don't exist
        if (!userData.stats) {
          updates.stats = {
            posts: 0,
            followers: 0,
            following: 0,
            profileViews: 0,
            postImpressions: 0
          };
        } else {
          // Update existing stats to include new fields
          if (typeof userData.stats.profileViews === 'undefined') {
            updates['stats.profileViews'] = 0;
          }
          if (typeof userData.stats.postImpressions === 'undefined') {
            updates['stats.postImpressions'] = 0;
          }
        }

        // Only update if there are changes
        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, 'communityUsers', userDoc.id), updates);
          console.log(`✅ Updated user: ${userData.email || userDoc.id}`);
          successCount++;
        } else {
          console.log(`⏭️  Skipped user (already migrated): ${userData.email || userDoc.id}`);
        }
      } catch (error) {
        console.error(`❌ Error updating user ${userDoc.id}:`, error);
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Success: ${successCount} users`);
    console.log(`   ⏭️  Skipped: ${snapshot.size - successCount - errorCount} users`);
    console.log(`   ❌ Errors: ${errorCount} users`);
    console.log('\n🎉 Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateUserProfiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

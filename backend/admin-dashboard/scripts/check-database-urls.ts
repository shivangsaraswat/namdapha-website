import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function checkCollection(collectionName: string) {
  console.log(`\n📋 ${collectionName.toUpperCase()}`);
  console.log('='.repeat(80));
  
  const snapshot = await db.collection(collectionName).get();
  
  let cloudinaryCount = 0;
  let imagekitCount = 0;
  let otherCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const imageUrl = data.image || data.imageUrl;

    if (imageUrl) {
      if (imageUrl.includes('cloudinary')) {
        cloudinaryCount++;
        console.log(`❌ CLOUDINARY: ${doc.id}`);
        console.log(`   ${imageUrl.substring(0, 100)}...`);
      } else if (imageUrl.includes('imagekit')) {
        imagekitCount++;
      } else {
        otherCount++;
        console.log(`⚠️  OTHER: ${doc.id}`);
        console.log(`   ${imageUrl.substring(0, 100)}...`);
      }
    }
  }

  console.log(`\n✅ ImageKit: ${imagekitCount}`);
  console.log(`❌ Cloudinary: ${cloudinaryCount}`);
  console.log(`⚠️  Other: ${otherCount}`);
}

async function main() {
  console.log('🔍 Checking Database URLs\n');

  await checkCollection('council');
  await checkCollection('teams');
  await checkCollection('events');
  await checkCollection('resources');

  console.log('\n' + '='.repeat(80));
  process.exit(0);
}

main().catch(console.error);

import * as admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
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

async function removeImageUrlField(collectionName: string) {
  console.log(`\n🔄 Removing imageUrl field from ${collectionName}...`);
  
  const snapshot = await db.collection(collectionName).get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    if (data.imageUrl) {
      await db.collection(collectionName).doc(doc.id).update({
        imageUrl: FieldValue.delete()
      });
      console.log(`  ✅ Removed imageUrl from: ${doc.id}`);
      updated++;
    }
  }

  console.log(`✅ ${collectionName}: ${updated} documents updated`);
}

async function main() {
  console.log('🗑️  Removing old imageUrl field from all collections\n');

  await removeImageUrlField('council');
  await removeImageUrlField('teams');
  await removeImageUrlField('events');
  await removeImageUrlField('resources');

  console.log('\n✅ Cleanup Complete!');
  process.exit(0);
}

main().catch(console.error);

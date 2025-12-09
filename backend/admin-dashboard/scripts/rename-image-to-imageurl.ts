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

async function renameField(collectionName: string) {
  console.log(`\n🔄 Renaming image → imageUrl in ${collectionName}...`);
  
  const snapshot = await db.collection(collectionName).get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    if (data.image) {
      await db.collection(collectionName).doc(doc.id).update({
        imageUrl: data.image,
        image: admin.firestore.FieldValue.delete()
      });
      console.log(`  ✅ Renamed: ${doc.id}`);
      updated++;
    }
  }

  console.log(`✅ ${collectionName}: ${updated} documents updated`);
}

async function main() {
  console.log('🔄 Renaming image field to imageUrl\n');

  await renameField('council');
  await renameField('teams');
  await renameField('events');
  await renameField('resources');

  console.log('\n✅ Complete! Frontend will now use ImageKit URLs');
  process.exit(0);
}

main().catch(console.error);

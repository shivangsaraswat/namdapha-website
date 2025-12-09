import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

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

async function checkCollection(name: string, fields: string[]) {
  console.log(`\n📋 Checking ${name}...`);
  const snapshot = await db.collection(name).get();
  let correct = 0;
  let incorrect = 0;
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    fields.forEach(field => {
      const url = data[field];
      if (url && typeof url === 'string') {
        if (url.includes('ik.imagekit.io') && url.endsWith('.webp')) {
          correct++;
        } else {
          console.log(`  ❌ ${data.name || doc.id} - ${field}: ${url}`);
          incorrect++;
        }
      }
    });
  });
  
  console.log(`  ✅ Correct: ${correct}`);
  console.log(`  ❌ Incorrect: ${incorrect}`);
}

async function main() {
  console.log('🔍 Checking ImageKit WebP Migration Status\n');
  
  await checkCollection('council', ['imageUrl']);
  await checkCollection('teams', ['imageUrl']);
  await checkCollection('activities', ['logo', 'poster']);
  
  console.log('\n✅ Check Complete!');
  process.exit(0);
}

main().catch(console.error);

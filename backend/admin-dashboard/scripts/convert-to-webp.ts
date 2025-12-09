import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import ImageKit from 'imagekit';
import sharp from 'sharp';
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

const imagekit1 = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY_1!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY_1!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT_1!,
});

const imagekit2 = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY_2!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY_2!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT_2!,
});

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function convertToWebP(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .webp({ quality: 95 })
    .toBuffer();
}

async function uploadToImageKit(buffer: Buffer, fileName: string, folder: string): Promise<string> {
  const isAccount1 = ['council', 'teams'].includes(folder);
  const imagekit = isAccount1 ? imagekit1 : imagekit2;

  const webpFileName = fileName.replace(/\.(jpg|jpeg|png|svg)$/i, '.webp');

  const result = await imagekit.upload({
    file: buffer.toString('base64'),
    fileName: webpFileName,
    folder: `/${folder}`,
  });

  return result.url;
}

async function deleteFromImageKit(url: string): Promise<void> {
  const isAccount1 = url.includes('namdaphahousee');
  const imagekit = isAccount1 ? imagekit1 : imagekit2;
  
  const fileId = url.split('/').pop()?.split('?')[0];
  if (fileId) {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error) {
      console.log(`  ⚠️  Could not delete old file: ${fileId}`);
    }
  }
}

async function convertCollection(collectionName: string) {
  console.log(`\n🔄 Converting ${collectionName} to WebP...`);
  
  const snapshot = await db.collection(collectionName).get();
  let converted = 0;
  let skipped = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    const imageUrl = data.image || data.imageUrl;

    if (!imageUrl || imageUrl.includes('.webp')) {
      skipped++;
      continue;
    }

    try {
      console.log(`  Converting: ${document.id}`);
      
      const originalBuffer = await downloadImage(imageUrl);
      const originalSize = originalBuffer.length;
      
      const webpBuffer = await convertToWebP(originalBuffer);
      const webpSize = webpBuffer.length;
      
      const fileName = imageUrl.split('/').pop()?.split('?')[0] || `${document.id}.jpg`;
      const newUrl = await uploadToImageKit(webpBuffer, fileName, collectionName);

      await db.collection(collectionName).doc(document.id).update({
        image: newUrl,
      });

      await deleteFromImageKit(imageUrl);

      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
      console.log(`  ✅ ${document.id}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(webpSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);
      converted++;
    } catch (error) {
      console.error(`  ❌ Failed: ${document.id}`, error);
    }
  }

  console.log(`✅ ${collectionName}: ${converted} converted, ${skipped} skipped`);
}

async function main() {
  console.log('🚀 Converting All Images to WebP\n');
  console.log('This will reduce bandwidth by ~70%\n');

  await convertCollection('council');
  await convertCollection('teams');
  await convertCollection('events');
  await convertCollection('resources');

  console.log('\n✅ Conversion Complete!');
  process.exit(0);
}

main().catch(console.error);

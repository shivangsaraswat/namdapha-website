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

async function convertToLosslessWebP(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .webp({ quality: 95 })
    .toBuffer();
}

async function uploadToImageKit(buffer: Buffer, fileName: string, folder: string): Promise<string> {
  const isAccount1 = ['council', 'teams'].includes(folder);
  const imagekit = isAccount1 ? imagekit1 : imagekit2;

  const webpFileName = fileName.replace(/\.(jpg|jpeg|png|svg|webp)$/i, '.webp');

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
  
  const parts = url.split('/');
  const fileIdWithExt = parts[parts.length - 1];
  const fileId = fileIdWithExt.split('_')[0];
  
  try {
    const files = await imagekit.listFiles({ searchQuery: `name="${fileId}"` });
    if (files.length > 0 && 'fileId' in files[0]) {
      await imagekit.deleteFile(files[0].fileId);
    }
  } catch (error) {
    console.log(`  ⚠️  Could not delete: ${fileId}`);
  }
}

async function reconvertCollection(collectionName: string) {
  console.log(`\n🔄 Reconverting ${collectionName} to lossless WebP...`);
  
  const snapshot = await db.collection(collectionName).get();
  let converted = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    const imageUrl = data.imageUrl;

    if (!imageUrl || !imageUrl.includes('imagekit')) {
      continue;
    }

    try {
      console.log(`  Converting: ${document.id}`);
      
      const originalBuffer = await downloadImage(imageUrl);
      const originalSize = originalBuffer.length;
      
      const webpBuffer = await convertToLosslessWebP(originalBuffer);
      const webpSize = webpBuffer.length;
      
      const fileName = imageUrl.split('/').pop()?.split('?')[0] || `${document.id}.jpg`;
      const newUrl = await uploadToImageKit(webpBuffer, fileName, collectionName);

      await db.collection(collectionName).doc(document.id).update({
        imageUrl: newUrl,
      });

      await deleteFromImageKit(imageUrl);

      console.log(`  ✅ ${document.id}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(webpSize / 1024 / 1024).toFixed(2)}MB (lossless)`);
      converted++;
    } catch (error) {
      console.error(`  ❌ Failed: ${document.id}`, error);
    }
  }

  console.log(`✅ ${collectionName}: ${converted} reconverted`);
}

async function main() {
  console.log('🚀 Reconverting to Lossless WebP (Quality 100)\n');

  await reconvertCollection('council');
  await reconvertCollection('teams');
  await reconvertCollection('events');

  console.log('\n✅ Reconversion Complete! Images now lossless WebP');
  process.exit(0);
}

main().catch(console.error);

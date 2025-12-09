// Migrate council and teams from Cloudinary to ImageKit with Quality 95
import ImageKit from 'imagekit';
import sharp from 'sharp';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY_1!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY_1!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT_1!,
});

// Original Cloudinary URLs
const cloudinaryUrls: Record<string, string> = {
  // Council
  'Cml34r12DZmB44hNMXij': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/fdtgzh3xsggcnrggyphq.png',
  'Hro9TAgbdvVwcZkSX2Os': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/kdxjymlhbhs9fpbasp8m.svg',
  'Iw7zpzFdKUnoMM4ateOp': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/s2sw4gu4o8ub1jebfuvm.png',
  'Pa2yLhBZLUQm0DbYjXeb': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/z42zydviujurv4pabjfr.svg',
  'QKRPZh8EHyer7e784QpU': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/a11oylsjumpklrzqhej3.svg',
  'QM6E9B7w1UhMvCykKprB': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/xl1u5zdjdibf1xqc1dyk.svg',
  'RITsfpO4Tl7LzP4HQECZ': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/gkhrssatptskzug91xv4.svg',
  'SsbRWylGpq9gRaqstIBX': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/df2gtjrqw6xuupc3tpzj.svg',
  'cimierp5SrFj0B9M3xTP': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/avavremnuqfexoivifip.svg',
  'dIBPTCohOQytdhZlpxKb': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/dqosizjw8lcdw55fjxes.svg',
  'jLD6Wwr59mHXmdxawg6p': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/fbq4anaee0f2p4jl5blf.svg',
  'n5rWKn1xelbagOZbNvfD': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/h2hgnbeki3ffziidkwqa.png',
  'oerLDxnR49wm46akGenw': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/council/yzws9idhnsdtalqr5hvj.svg',
  // Teams
  '2YgsgNWu8yJvSe7VK9C7': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/ntkimz3gjbyj3h9kalk8.svg',
  'C0i224yfVyeJJJzsJrv7': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/oklgjzyr1zmg5ig3w1mp.svg',
  'FHT0JZsIg2HfBFcyaU0f': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/zi1ib2nurnyokgfxozin.svg',
  'Krixi4ivmJlRyYsFn7qh': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/vf40srqzyxqb3x5vv0hd.svg',
  'QgNJAOUVOpMTc2TrBDXs': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/m7xrqfqyjjhgggkk2ysy.svg',
  'RBF8OJoFvwMF1GwlESok': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/dymalye2qx1mintuk7xr.svg',
  'RyJ7zS683fJdPxr7Ls3w': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/cbawbkjftlcpwvn1729m.png',
  'bl5xPI0KoafdQ2sk8PAx': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/eytuo7swvxbmmtw72ade.svg',
  'gI8kpXXOd2CMo6NnV2fE': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/avzbbzkpdp0nd9waxz01.svg',
  'goZPgqlE4c5Lu7EV2dJb': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/xgmzofr3mw4k7m0mauhd.svg',
  'qYVv2CpID0nubNbHj88a': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/ynsa4o7xj25hdiplohpl.svg',
  'yFGY0xZq1HknSdC86c1s': 'https://res.cloudinary.com/dsbte4ypf/image/upload/v1762259365/teams/gvdafyrws1jfkqbw6tnh.svg',
};

async function migrate(docId: string, cloudinaryUrl: string, collection: string) {
  try {
    const response = await fetch(cloudinaryUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const webp = await sharp(buffer).webp({ quality: 95 }).toBuffer();
    
    const fileName = cloudinaryUrl.split('/').pop()?.replace(/\.(jpg|jpeg|png|svg)$/i, '.webp') || `${docId}.webp`;
    const result = await imagekit.upload({
      file: webp.toString('base64'),
      fileName: fileName,
      folder: `/${collection}`,
    });
    
    await db.collection(collection).doc(docId).update({ imageUrl: result.url });
    console.log(`✅ ${docId}`);
  } catch (error) {
    console.error(`❌ ${docId}:`, error);
  }
}

async function main() {
  console.log('🚀 Remigrating Council & Teams with Quality 95\n');
  
  for (const [docId, url] of Object.entries(cloudinaryUrls)) {
    const collection = docId.length === 20 ? 'council' : 'teams';
    await migrate(docId, url, collection);
  }
  
  console.log('\n✅ Complete!');
  process.exit(0);
}

main();

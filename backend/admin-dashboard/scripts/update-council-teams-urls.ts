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

// Mapping of Cloudinary public IDs to Firestore document IDs
const councilMapping: Record<string, string> = {
  'fdtgzh3xsggcnrggyphq': 'Cml34r12DZmB44hNMXij', // Sravya
  'kdxjymlhbhs9fpbasp8m': 'Hro9TAgbdvVwcZkSX2Os', // Harshita
  's2sw4gu4o8ub1jebfuvm': 'Iw7zpzFdKUnoMM4ateOp', // Devansh
  'z42zydviujurv4pabjfr': 'Pa2yLhBZLUQm0DbYjXeb', // Suraj
  'a11oylsjumpklrzqhej3': 'QKRPZh8EHyer7e784QpU', // Sadhana
  'xl1u5zdjdibf1xqc1dyk': 'QM6E9B7w1UhMvCykKprB', // Abinsh
  'gkhrssatptskzug91xv4': 'RITsfpO4Tl7LzP4HQECZ', // Konark
  'df2gtjrqw6xuupc3tpzj': 'SsbRWylGpq9gRaqstIBX', // Prasann
  'avavremnuqfexoivifip': 'cimierp5SrFj0B9M3xTP', // Subham
  'dqosizjw8lcdw55fjxes': 'dIBPTCohOQytdhZlpxKb', // Shaurya
  'fbq4anaee0f2p4jl5blf': 'jLD6Wwr59mHXmdxawg6p', // Adrija
  'h2hgnbeki3ffziidkwqa': 'n5rWKn1xelbagOZbNvfD', // Ujjwal
  'yzws9idhnsdtalqr5hvj': 'oerLDxnR49wm46akGenw', // Lakshya
};

const teamsMapping: Record<string, string> = {
  'ntkimz3gjbyj3h9kalk8': '2YgsgNWu8yJvSe7VK9C7',
  'oklgjzyr1zmg5ig3w1mp': 'C0i224yfVyeJJJzsJrv7',
  'zi1ib2nurnyokgfxozin': 'FHT0JZsIg2HfBFcyaU0f',
  'vf40srqzyxqb3x5vv0hd': 'Krixi4ivmJlRyYsFn7qh',
  'm7xrqfqyjjhgggkk2ysy': 'QgNJAOUVOpMTc2TrBDXs',
  'dymalye2qx1mintuk7xr': 'RBF8OJoFvwMF1GwlESok',
  'cbawbkjftlcpwvn1729m': 'RyJ7zS683fJdPxr7Ls3w',
  'eytuo7swvxbmmtw72ade': 'bl5xPI0KoafdQ2sk8PAx',
  'avzbbzkpdp0nd9waxz01': 'gI8kpXXOd2CMo6NnV2fE',
  'xgmzofr3mw4k7m0mauhd': 'goZPgqlE4c5Lu7EV2dJb',
  'ynsa4o7xj25hdiplohpl': 'qYVv2CpID0nubNbHj88a',
  'gvdafyrws1jfkqbw6tnh': 'yFGY0xZq1HknSdC86c1s',
};

async function updateUrls() {
  console.log('Updating Council URLs...');
  for (const [cloudinaryId, docId] of Object.entries(councilMapping)) {
    const newUrl = `https://ik.imagekit.io/namdaphahousee/council/${cloudinaryId}.webp`;
    await db.collection('council').doc(docId).update({ imageUrl: newUrl });
    console.log(`✅ ${docId}`);
  }

  console.log('\nUpdating Teams URLs...');
  for (const [cloudinaryId, docId] of Object.entries(teamsMapping)) {
    const newUrl = `https://ik.imagekit.io/namdaphahousee/teams/${cloudinaryId}.webp`;
    await db.collection('teams').doc(docId).update({ imageUrl: newUrl });
    console.log(`✅ ${docId}`);
  }

  console.log('\n✅ All URLs updated!');
  process.exit(0);
}

updateUrls();

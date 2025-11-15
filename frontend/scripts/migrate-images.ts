import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const imageMapping: Record<string, string> = {
  '/bgmi.jpg': '/bgmi.webp',
  '/chess.jpg': '/chess.webp',
  '/coc.jpg': '/coc.webp',
  '/valorant.jpg': '/valorant.webp',
  '/freefire.jpg': '/freefire.webp',
  '/photography.jpg': '/photography.webp',
  '/devansh.jpeg': '/devansh.webp',
  '/whatsapp-1.jpg': '/whatsapp-1.webp',
  '/whatsapp-2.jpg': '/whatsapp-2.webp',
};

async function migrateImages() {
  const activitiesRef = collection(db, 'activities');
  const snapshot = await getDocs(activitiesRef);
  
  let updated = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const oldPoster = data.poster;
    
    if (imageMapping[oldPoster]) {
      const newPoster = imageMapping[oldPoster];
      await updateDoc(doc(db, 'activities', docSnap.id), {
        poster: newPoster,
        updatedAt: new Date(),
      });
      console.log(`✓ Updated ${docSnap.id}: ${oldPoster} → ${newPoster}`);
      updated++;
    }
  }
  
  console.log(`\nMigration complete! Updated ${updated} activities.`);
}

migrateImages().catch(console.error);

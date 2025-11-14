import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc } from 'firebase/firestore';

export async function POST() {
  try {
    const usersRef = collection(db, 'communityUsers');
    const snapshot = await getDocs(usersRef);
    
    let fixed = 0;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const stats = data.stats || {};
      
      const needsUpdate = 
        stats.followers === undefined || 
        stats.following === undefined || 
        stats.posts === undefined ||
        stats.profileViews === undefined ||
        stats.postImpressions === undefined ||
        stats.followers < 0 ||
        stats.following < 0;
      
      if (needsUpdate) {
        await updateDoc(doc.ref, {
          'stats.followers': Math.max(0, stats.followers || 0),
          'stats.following': Math.max(0, stats.following || 0),
          'stats.posts': Math.max(0, stats.posts || 0),
          'stats.profileViews': Math.max(0, stats.profileViews || 0),
          'stats.postImpressions': Math.max(0, stats.postImpressions || 0)
        });
        fixed++;
      }
    }
    
    return NextResponse.json({ success: true, fixed });
  } catch (error) {
    console.error('Error fixing stats:', error);
    return NextResponse.json({ error: 'Failed to fix stats' }, { status: 500 });
  }
}

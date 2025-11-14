import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const usersRef = collection(db, 'communityUsers');
    const q = query(usersRef, where('email', '==', session.user.email));
    const userSnapshot = await getDocs(q);
    
    let userName = session.user.name || '';
    let userImage = session.user.image || '';
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userName = userData.name || session.user.name || '';
      userImage = userData.profileImage || session.user.image || '';
    }

    await addDoc(collection(db, 'communityComments'), {
      postId,
      userId: session.user.email,
      username: session.user.email.split('@')[0],
      userName,
      userImage,
      content: content.trim(),
      likes: 0,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'communityPosts', postId), {
      comments: increment(1)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Comment error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

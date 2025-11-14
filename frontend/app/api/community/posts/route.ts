import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, imageUrls } = await req.json();

    if (!content?.trim() && (!imageUrls || imageUrls.length === 0)) {
      return NextResponse.json({ error: 'Content or images required' }, { status: 400 });
    }

    // Get user's community profile
    const usersRef = collection(db, 'communityUsers');
    const q = query(usersRef, where('email', '==', session.user.email));
    const userSnapshot = await getDocs(q);
    let userProfileImage = session.user.image;
    let userSlug = session.user.email?.split('@')[0] || 'user';
    let userName = session.user.name || '';
    let userHeadline = '';
    let userLocation = '';
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userProfileImage = userData.profileImage || session.user.image;
      userSlug = userData.profileSlug || userSlug;
      userName = userData.name || session.user.name || '';
      userHeadline = userData.headline || '';
      userLocation = userData.location || '';
    }

    const postData = {
      userId: session.user.email || '',
      username: session.user.email?.split('@')[0] || 'user',
      userName: userName,
      userHeadline: userHeadline,
      userLocation: userLocation,
      userSlug: userSlug,
      userImage: userProfileImage || null,
      content: content?.trim() || '',
      imageUrls: imageUrls || [],
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'communityPosts'), postData);

    return NextResponse.json({ 
      success: true, 
      postId: docRef.id 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Failed to create post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

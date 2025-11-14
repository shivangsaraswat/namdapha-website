import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usersRef = collection(db, 'communityUsers');
    const q = query(usersRef, where('email', '==', session.user.email));
    const existingUser = await getDocs(q);
    
    if (!existingUser.empty) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const { name, headline, location, bio, website, profileImage, coverImage } = await req.json();

    if (!name || !headline || !bio) {
      return NextResponse.json({ error: 'Name, headline, and bio are required' }, { status: 400 });
    }

    const username = session.user.email.split('@')[0];
    const profileSlug = `${username}-${Date.now().toString(36)}`;

    await addDoc(collection(db, 'communityUsers'), {
      email: session.user.email,
      username,
      profileSlug,
      name,
      headline,
      location: location || '',
      bio,
      website: website || '',
      profileImage: profileImage || '',
      coverImage: coverImage || '',
      status: 'active',
      role: 'member',
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      stats: { posts: 0, followers: 0, following: 0, profileViews: 0, postImpressions: 0 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}

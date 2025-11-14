import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, query, where, getDocs, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    
    const followsRef = collection(db, 'communityFollows');
    const q = query(followsRef, where('followerId', '==', session.user.email), where('followingId', '==', targetUserId));
    const existing = await getDocs(q);
    
    if (!existing.empty) {
      return NextResponse.json({ error: 'Already following' }, { status: 400 });
    }

    await addDoc(followsRef, {
      followerId: session.user.email,
      followingId: targetUserId,
      createdAt: serverTimestamp()
    });

    const usersRef = collection(db, 'communityUsers');
    const followerQuery = query(usersRef, where('email', '==', session.user.email));
    const followingQuery = query(usersRef, where('email', '==', targetUserId));
    
    const [followerSnap, followingSnap] = await Promise.all([
      getDocs(followerQuery),
      getDocs(followingQuery)
    ]);

    if (!followerSnap.empty) {
      await updateDoc(followerSnap.docs[0].ref, { 'stats.following': increment(1) });
    }
    if (!followingSnap.empty) {
      await updateDoc(followingSnap.docs[0].ref, { 'stats.followers': increment(1) });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to follow' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    
    const followsRef = collection(db, 'communityFollows');
    const q = query(followsRef, where('followerId', '==', session.user.email), where('followingId', '==', targetUserId));
    const existing = await getDocs(q);
    
    if (existing.empty) {
      return NextResponse.json({ error: 'Not following' }, { status: 400 });
    }

    await deleteDoc(existing.docs[0].ref);

    const usersRef = collection(db, 'communityUsers');
    const followerQuery = query(usersRef, where('email', '==', session.user.email));
    const followingQuery = query(usersRef, where('email', '==', targetUserId));
    
    const [followerSnap, followingSnap] = await Promise.all([
      getDocs(followerQuery),
      getDocs(followingQuery)
    ]);

    if (!followerSnap.empty) {
      await updateDoc(followerSnap.docs[0].ref, { 'stats.following': increment(-1) });
    }
    if (!followingSnap.empty) {
      await updateDoc(followingSnap.docs[0].ref, { 'stats.followers': increment(-1) });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unfollow' }, { status: 500 });
  }
}

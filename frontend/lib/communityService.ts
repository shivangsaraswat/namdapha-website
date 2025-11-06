import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, limit, Timestamp, increment } from 'firebase/firestore';
import { db } from './firebase';
import { Post, Comment, CreatePostData } from './types/community';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
};

export const createPost = async (userId: string, userName: string, userRole: string, data: CreatePostData): Promise<string> => {
  const slug = generateSlug(data.title);
  const excerpt = data.content.substring(0, 160);
  
  const postRef = await addDoc(collection(db, 'posts'), {
    slug,
    title: data.title,
    excerpt,
    content: data.content,
    authorId: userId,
    authorName: userName,
    authorRole: userRole,
    type: data.type,
    isPinned: false,
    isPublished: true,
    reactions: { like: 0, helpful: 0, celebrate: 0 },
    commentCount: 0,
    shareCount: 0,
    viewCount: 0,
    tags: data.tags,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    publishedAt: Timestamp.now()
  });
  
  return postRef.id;
};

export const getPosts = async (limitCount = 20): Promise<Post[]> => {
  const q = query(
    collection(db, 'posts'),
    where('isPublished', '==', true),
    orderBy('isPinned', 'desc'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    publishedAt: doc.data().publishedAt?.toDate()
  })) as Post[];
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  await updateDoc(doc.ref, { viewCount: increment(1) });
  
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    publishedAt: doc.data().publishedAt?.toDate()
  } as Post;
};

export const addReaction = async (postId: string, reactionType: 'like' | 'helpful' | 'celebrate') => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    [`reactions.${reactionType}`]: increment(1)
  });
};

export const incrementShareCount = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, { shareCount: increment(1) });
};

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const auth = getAuth();

export type UserRole = 'admin' | 'verified' | 'member';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return userDoc.data() as UserProfile;
};

export const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  await setDoc(doc(db, 'users', userId), {
    id: userId,
    isApproved: false,
    role: 'member',
    createdAt: new Date(),
    ...data
  });
};

export const signIn = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUp = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);

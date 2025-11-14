import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export async function isAdminUser(email: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'users'),
      where('email', '==', email),
      where('isActive', '==', true),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking admin user:', error);
    return false;
  }
}

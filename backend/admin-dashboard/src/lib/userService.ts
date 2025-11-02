import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { UserRole } from '@/types/auth';

export interface DeletePermissions {
  // Council
  'council-leadership'?: boolean;
  'council-coordinators'?: boolean;
  
  // Teams
  teams?: boolean;
  
  // Events
  events?: boolean;
  
  // Certificates
  certificates?: boolean;
  
  // Link Tree
  'link-tree-social'?: boolean;
  'link-tree-important'?: boolean;
  
  // Resource Hub
  'resource-hub-pyqs'?: boolean;
  'resource-hub-contacts'?: boolean;
  
  // Forms
  forms?: boolean;
}

export interface UserData {
  email: string;
  role: UserRole;
  isActive: boolean;
  deletePermissions?: DeletePermissions;
  lastLogin?: Date;
  createdAt: Date;
}

/**
 * Fetches user data from Firestore database
 * Collection: 'users'
 * Document ID: user email
 * Fields: email, role, isActive, deletePermissions, lastLogin, createdAt
 */
export async function getUserData(email: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', email));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        lastLogin: data.lastLogin?.toDate(),
        createdAt: data.createdAt?.toDate()
      } as UserData;
    }
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    throw new Error('Failed to fetch user data. Please check your internet connection.');
  }
  return null;
}

export async function updateLastLogin(email: string) {
  try {
    await updateDoc(doc(db, 'users', email), {
      lastLogin: new Date()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

export async function createUser(email: string, role: UserRole, isActive = true) {
  try {
    await setDoc(doc(db, 'users', email), {
      email,
      role,
      isActive,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

export async function getAllUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      email: doc.id,
      ...doc.data(),
      lastLogin: doc.data().lastLogin?.toDate(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

export async function addUser(email: string, role: UserRole, isActive = true) {
  await createUser(email, role, isActive);
}

export async function removeUser(email: string) {
  try {
    await deleteDoc(doc(db, 'users', email));
  } catch (error) {
    console.error('Error removing user:', error);
  }
}

/**
 * Updates user data in Firestore database
 * This includes deletePermissions which are stored as a nested object
 */
export async function updateUser(email: string, updates: Partial<UserData>) {
  try {
    await updateDoc(doc(db, 'users', email), updates);
    console.log('User updated in Firestore:', email, updates);
  } catch (error) {
    console.error('Error updating user in Firestore:', error);
    throw new Error('Failed to update user. Please check your internet connection.');
  }
}

export async function toggleUser(email: string) {
  try {
    const userData = await getUserData(email);
    if (userData) {
      await updateDoc(doc(db, 'users', email), {
        isActive: !userData.isActive
      });
    }
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
}
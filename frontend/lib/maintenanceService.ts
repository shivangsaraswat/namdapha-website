import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface MaintenanceMode {
  isEnabled: boolean;
  message: string;
  estimatedEndTime?: string;
}

export const getMaintenanceStatus = async (): Promise<MaintenanceMode> => {
  try {
    const docRef = doc(db, 'settings/maintenance');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as MaintenanceMode;
    }
    
    return { isEnabled: false, message: '' };
  } catch (error) {
    console.error('Error getting maintenance status:', error);
    return { isEnabled: false, message: '' };
  }
};

import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface MaintenanceMode {
  isEnabled: boolean;
  message: string;
  estimatedEndTime?: string;
  enabledBy?: string;
  enabledAt?: Date;
}

const MAINTENANCE_DOC = 'settings/maintenance';

export const getMaintenanceStatus = async (): Promise<MaintenanceMode> => {
  try {
    const docRef = doc(db, MAINTENANCE_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as MaintenanceMode;
    }
    
    return {
      isEnabled: false,
      message: 'We are currently performing scheduled maintenance. Please check back soon.',
    };
  } catch (error) {
    console.error('Error getting maintenance status:', error);
    return {
      isEnabled: false,
      message: 'We are currently performing scheduled maintenance. Please check back soon.',
    };
  }
};

export const setMaintenanceMode = async (
  isEnabled: boolean,
  message: string,
  estimatedEndTime?: string,
  enabledBy?: string
): Promise<void> => {
  try {
    const docRef = doc(db, MAINTENANCE_DOC);
    const data: Record<string, unknown> = {
      isEnabled,
      message,
      enabledAt: new Date(),
    };
    
    if (estimatedEndTime) {
      data.estimatedEndTime = estimatedEndTime;
    }
    
    if (enabledBy) {
      data.enabledBy = enabledBy;
    }
    
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error setting maintenance mode:', error);
    throw error;
  }
};

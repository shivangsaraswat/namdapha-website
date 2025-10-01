import { db } from './firebase';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';

// API functions using Firestore directly
export const api = {
  // Get Events
  async getEvents() {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get Council Members
  async getCouncil() {
    try {
      const councilRef = collection(db, 'council');
      const snapshot = await getDocs(councilRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching council:', error);
      throw error;
    }
  },

  // Get Teams
  async getTeams() {
    try {
      const teamsRef = collection(db, 'teams');
      const snapshot = await getDocs(teamsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  // Get Resources
  async getResources() {
    try {
      const resourcesRef = collection(db, 'resources');
      const snapshot = await getDocs(resourcesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Submit Contact Form
  async submitContact(data) {
    try {
      const contactsRef = collection(db, 'contacts');
      await addDoc(contactsRef, {
        ...data,
        timestamp: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  }
};
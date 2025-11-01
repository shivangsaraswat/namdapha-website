import { resourceService } from './resourceService';
import { pyqService } from './pyqService';
import { contactService } from './contactService';
import { linkService } from './linkService';

// Preload ALL data on app initialization for instant page loads
export async function preloadCriticalData() {
  try {
    const { councilService } = await import('./councilService');
    // Fetch everything in parallel
    await Promise.allSettled([
      resourceService.getActiveCategories(),
      resourceService.getPublishedResources(),
      pyqService.getPublishedPYQs(),
      contactService.getActiveContacts(),
      linkService.getActiveLinksByType('social'),
      linkService.getActiveLinksByType('important'),
      councilService.getVisibleMembers(),
    ]);
  } catch (error) {
    console.error('Preload error:', error);
  }
}

// Preload data for specific pages
export const preloadStrategies = {
  resources: async () => {
    await Promise.allSettled([
      resourceService.getActiveCategories(),
      resourceService.getPublishedResources(),
    ]);
  },
  
  pyqs: async () => {
    await pyqService.getPublishedPYQs();
  },
  
  contacts: async () => {
    await contactService.getActiveContacts();
  },
  
  links: async () => {
    await Promise.allSettled([
      linkService.getActiveLinksByType('social'),
      linkService.getActiveLinksByType('important'),
    ]);
  },
};

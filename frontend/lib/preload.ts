import { resourceService } from './resourceService';
import { pyqService } from './pyqService';
import { contactService } from './contactService';
import { linkService } from './linkService';

// Preload critical data on app initialization
export async function preloadCriticalData() {
  try {
    await Promise.allSettled([
      resourceService.getActiveCategories(),
      resourceService.getPublishedResources(),
      linkService.getActiveLinksByType('social'),
      linkService.getActiveLinksByType('important'),
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

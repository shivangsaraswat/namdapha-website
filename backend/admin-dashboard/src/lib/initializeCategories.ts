import { resourceService } from './resourceService';

export const defaultCategories = [
  {
    name: "Student Handbook",
    description: "Manage comprehensive study materials and course handbooks",
    icon: "FaBook",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    order: 1,
    isActive: true
  },
  {
    name: "Grading Document",
    description: "Manage academic progress tracking and graded assignments",
    icon: "FaChartLine",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    order: 2,
    isActive: true
  },
  {
    name: "PYQs",
    description: "Manage Previous Year Questions papers for exam preparation",
    icon: "FaFileAlt",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    order: 3,
    isActive: true
  },
  {
    name: "Important Links",
    description: "Manage essential academic portals and online resources",
    icon: "FaLink",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    order: 4,
    isActive: true
  },
  {
    name: "Important Contacts",
    description: "Manage faculty and administrative contact directory",
    icon: "FaAddressBook",
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    order: 5,
    isActive: true
  },
  {
    name: "Grade Predictor",
    description: "Manage grade prediction tools and resources",
    icon: "FaChartBar",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    order: 6,
    isActive: true
  },
  {
    name: "Grade Calculator",
    description: "Manage GPA and semester grade calculation tools",
    icon: "FaCalculator",
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50",
    order: 7,
    isActive: true
  },
  {
    name: "Join WhatsApp Group",
    description: "Manage WhatsApp group links and community resources",
    icon: "FaWhatsapp",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    order: 8,
    isActive: true
  },
  {
    name: "Notes",
    description: "Manage comprehensive study notes",
    icon: "FaBook",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    order: 9,
    isActive: true
  },
  {
    name: "Video Lectures",
    description: "Manage video lectures and playlists",
    icon: "FaVideo",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    order: 10,
    isActive: true
  }
];

export async function initializeCategories() {
  try {
    const existingCategories = await resourceService.getAllCategories();
    const existingNames = existingCategories.map(c => c.name);
    
    if (existingCategories.length === 0) {
      console.log('Initializing default categories...');
      
      for (const category of defaultCategories) {
        await resourceService.addCategory({
          ...category,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      console.log('Default categories initialized successfully!');
      return true;
    } else {
      // Add missing categories
      let added = false;
      for (const category of defaultCategories) {
        if (!existingNames.includes(category.name)) {
          console.log(`Adding missing category: ${category.name}`);
          await resourceService.addCategory({
            ...category,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          added = true;
        }
      }
      
      if (added) {
        console.log('Missing categories added successfully!');
      } else {
        console.log('All categories already exist.');
      }
      return added;
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
    throw error;
  }
}

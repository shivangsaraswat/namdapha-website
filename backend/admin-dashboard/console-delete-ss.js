// Run this script in the browser console while on the admin dashboard
// This will permanently delete the SS user from the database

async function deleteSSUserFromConsole() {
  try {
    // Import Firebase functions
    const { doc, deleteDoc } = await import('firebase/firestore');
    
    // Get the Firebase db instance (assuming it's available globally)
    // You might need to adjust this based on how Firebase is initialized in your app
    const db = window.db || (await import('./src/lib/firebase.ts')).db;
    
    // Delete the SS user document
    await deleteDoc(doc(db, 'users', 'ss@gmail.com'));
    
    console.log('✅ Successfully deleted SS user from database');
    alert('SS user has been permanently deleted from the database');
    
    // Refresh the page to update the user list
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error deleting SS user:', error);
    alert('Failed to delete SS user: ' + error.message);
  }
}

// Execute the function
deleteSSUserFromConsole();
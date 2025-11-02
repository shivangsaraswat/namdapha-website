import { getUserData, DeletePermissions } from './userService';

export async function canDelete(userEmail: string, userRole: string, resource: keyof DeletePermissions): Promise<boolean> {
  try {
    // Super admin can always delete
    if (userRole === 'super-admin') {
      return true;
    }
    
    // Check user's specific delete permissions from Firestore
    const userData = await getUserData(userEmail);
    return userData?.deletePermissions?.[resource] === true;
  } catch (error) {
    console.error('Error checking delete permission:', error);
    // If offline or error, deny permission for safety
    return false;
  }
}

export async function updateDeletePermissions(email: string, permissions: DeletePermissions) {
  try {
    const { updateUser } = await import('./userService');
    // This saves to Firestore database
    await updateUser(email, { deletePermissions: permissions });
    return { success: true };
  } catch (error) {
    console.error('Error updating delete permissions:', error);
    throw new Error('Failed to update permissions. Please check your internet connection.');
  }
}

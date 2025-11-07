import { NextResponse } from 'next/server';
import { removeUser } from '@/lib/userService';

export async function DELETE() {
  try {
    // Delete the SS user permanently from Firebase
    await removeUser('ss@gmail.com');
    
    return NextResponse.json({ 
      success: true, 
      message: 'SS user deleted permanently from database' 
    });
  } catch (error) {
    console.error('Error deleting SS user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete SS user' 
    }, { status: 500 });
  }
}
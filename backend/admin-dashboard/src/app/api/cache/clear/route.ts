import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

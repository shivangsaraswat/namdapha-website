import { NextRequest, NextResponse } from 'next/server';
import { isEmailAuthorized } from '@/lib/googleSheetAuth';
import { isAdminUser } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ allowed: false, error: 'Email required' }, { status: 400 });
    }

    // Check if user is admin first
    const isAdmin = await isAdminUser(email);
    if (isAdmin) {
      return NextResponse.json({ allowed: true, source: 'admin' });
    }

    // Then check Google Sheet authorization
    const allowed = await isEmailAuthorized(email);
    return NextResponse.json({ allowed, source: 'sheet' });
  } catch (error) {
    return NextResponse.json({ allowed: false, error: 'Server error' }, { status: 500 });
  }
}

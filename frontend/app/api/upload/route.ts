import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'community';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    cloudinaryFormData.append('timestamp', timestamp);
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudinaryFormData }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message || 'Upload failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ url: data.secure_url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

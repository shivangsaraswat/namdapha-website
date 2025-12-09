import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const getImageKitInstance = (url: string) => {
  const isAccount1 = url.includes('namdaphahousee');
  
  return new ImageKit({
    publicKey: isAccount1 
      ? process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY_1! 
      : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY_2!,
    privateKey: isAccount1 
      ? process.env.IMAGEKIT_PRIVATE_KEY_1! 
      : process.env.IMAGEKIT_PRIVATE_KEY_2!,
    urlEndpoint: isAccount1 
      ? process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT_1! 
      : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT_2!,
  });
};

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    const fileId = imageUrl.split('/').pop()?.split('?')[0];
    if (!fileId) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    const imagekit = getImageKitInstance(imageUrl);
    
    const files = await imagekit.listFiles({ searchQuery: `name="${fileId}"` });
    if (files.length > 0 && 'fileId' in files[0]) {
      await imagekit.deleteFile(files[0].fileId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

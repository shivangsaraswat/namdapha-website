import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import sharp from 'sharp';

// Increase body size limit to 10MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const getImageKitInstance = (folder: string) => {
  const isAccount1 = ['council', 'teams'].includes(folder);
  
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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'council';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Convert to WebP quality 95 (near-perfect quality)
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 95 })
      .toBuffer();
    buffer = Buffer.from(webpBuffer);

    const base64 = buffer.toString('base64');
    const webpFileName = file.name.replace(/\.(jpg|jpeg|png|svg)$/i, '.webp');

    const imagekit = getImageKitInstance(folder);

    const result = await imagekit.upload({
      file: base64,
      fileName: webpFileName,
      folder: `/${folder}`,
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

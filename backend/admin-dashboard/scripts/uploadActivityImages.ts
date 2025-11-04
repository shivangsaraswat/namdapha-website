import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageFiles = [
  // Logos
  { local: '/5_20251023_223111_0004.svg', type: 'logo', name: 'valorant-logo' },
  { local: '/2_20251023_223111_0001.svg', type: 'logo', name: 'clanforge-logo' },
  { local: '/8_20251023_223111_0007.svg', type: 'logo', name: 'battleground-logo' },
  { local: '/7_20251023_223111_0006.svg', type: 'logo', name: 'knights64-logo' },
  { local: '/FreeStorm.png', type: 'logo', name: 'firestorm-logo' },
  { local: '/4_20251023_223111_0003.svg', type: 'logo', name: 'geeksquad-logo' },
  { local: '/11_20251023_223111_0010.svg', type: 'logo', name: 'electrosphere-logo' },
  { local: '/6_20251023_223111_0005.svg', type: 'logo', name: 'trivia-logo' },
  { local: '/9_20251023_223111_0008.svg', type: 'logo', name: 'kavya-logo' },
  { local: '/10_20251023_223111_0009.svg', type: 'logo', name: 'pulseofarts-logo' },
  { local: '/3_20251023_223111_0002.svg', type: 'logo', name: 'podium-logo' },
  // Posters
  { local: '/valorant.jpg', type: 'poster', name: 'valorant-poster' },
  { local: '/coc.jpg', type: 'poster', name: 'coc-poster' },
  { local: '/bgmi.jpg', type: 'poster', name: 'bgmi-poster' },
  { local: '/chess.jpg', type: 'poster', name: 'chess-poster' },
  { local: '/freefire.jpg', type: 'poster', name: 'freefire-poster' },
  { local: '/photography.jpg', type: 'poster', name: 'photography-poster' },
];

async function uploadImages() {
  const frontendPublicPath = path.join(__dirname, '../../../frontend/public');
  const uploadedUrls: Record<string, string> = {};

  console.log('Starting image upload to Cloudinary...\n');

  for (const image of imageFiles) {
    const localPath = path.join(frontendPublicPath, image.local);
    
    try {
      if (!fs.existsSync(localPath)) {
        console.log(`⚠️  File not found: ${localPath}`);
        continue;
      }

      console.log(`Uploading ${image.name}...`);
      
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'activities',
        public_id: image.name,
        resource_type: 'auto',
      });

      uploadedUrls[image.local] = result.secure_url;
      console.log(`✅ Uploaded: ${image.name} -> ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${image.name}:`, error);
    }
  }

  console.log('\n📋 Upload Summary:');
  console.log(JSON.stringify(uploadedUrls, null, 2));
  
  // Save mapping to file
  const mappingPath = path.join(__dirname, 'imageMapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\n💾 Mapping saved to: ${mappingPath}`);
}

uploadImages();

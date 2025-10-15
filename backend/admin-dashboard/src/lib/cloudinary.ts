export async function uploadImage(file: File, folder: string = 'council'): Promise<{ url: string; compressed?: boolean; originalSize?: number; finalSize?: number; message?: string }> {
  const MAX_FILE_SIZE = 10485760; // 10 MB (Cloudinary max)

  const originalSize = file.size;

  // Helper: compress image using canvas
  async function compressImage(inputFile: File): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));

          let width = img.naturalWidth;
          let height = img.naturalHeight;

          // Start parameters
          let quality = 0.92;
          let scale = 1.0;

          // Try iterations to get under size limit
          for (let i = 0; i < 15; i++) {
            canvas.width = Math.max(1, Math.floor(width * scale));
            canvas.height = Math.max(1, Math.floor(height * scale));

            // draw with smoothing
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // get blob
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const blob: Blob | null = await new Promise((res) => canvas.toBlob(res as BlobCallback, inputFile.type || 'image/jpeg', quality));
            if (!blob) return reject(new Error('Failed to create compressed image'));

            if (blob.size <= MAX_FILE_SIZE) return resolve(blob);

            // otherwise reduce quality or scale
            if (quality > 0.5) {
              quality = Math.max(0.45, quality - 0.08);
            } else {
              scale = scale * 0.85; // reduce dimensions
            }

            // stop if image becomes very small
            if (canvas.width < 300 || canvas.height < 300) {
              // accept current blob even if larger, to avoid infinite loop
              return resolve(blob);
            }
          }

          // fallback: final attempt with low quality
          const finalBlob: Blob | null = await new Promise((res) => canvas.toBlob(res as BlobCallback, inputFile.type || 'image/jpeg', 0.4));
          if (!finalBlob) return reject(new Error('Failed to create final compressed image'));
          return resolve(finalBlob);
        } catch (e) {
          return reject(e);
        }
      };

      // create object URL from file
      const url = URL.createObjectURL(inputFile);
      img.src = url;

      // revoke url after load to free memory
      img.addEventListener('load', () => URL.revokeObjectURL(url));
    });
  }

  let toUploadFile: File = file;
  let compressed = false;
  let finalSize = originalSize;
  let message: string | undefined;

  if (file.size > MAX_FILE_SIZE) {
    // Only attempt compression for images
    if (!file.type.startsWith('image/')) {
      throw new Error('File exceeds Cloudinary maximum size of 10 MB and is not an image. Please reduce size manually.');
    }

    try {
      const compressedBlob = await compressImage(file);
      finalSize = compressedBlob.size;
      // create new File
      const newFile = new File([compressedBlob], file.name, { type: compressedBlob.type || file.type });
      toUploadFile = newFile;
      compressed = true;
      message = `Image automatically compressed from ${(originalSize / 1024 / 1024).toFixed(2)} MB to ${(finalSize / 1024 / 1024).toFixed(2)} MB before upload.`;
      console.info(message);
    } catch (e) {
      console.warn('Automatic compression failed, falling back to original file. Error:', e);
      // proceed with original file and let server/cloudinary handle rejection
      message = 'Automatic compression failed; uploaded original file. If upload fails, reduce image size to under 10 MB.';
    }
  }

  const formData = new FormData();
  formData.append('file', toUploadFile);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();

  return { url: result.url, compressed, originalSize, finalSize, message };
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const response = await fetch('/api/delete-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error('Image deletion failed');
  }
}
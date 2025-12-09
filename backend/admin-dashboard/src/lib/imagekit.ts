export async function uploadImage(file: File, folder: string = 'council'): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/imagekit-upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  return { url: result.url };
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const response = await fetch('/api/imagekit-delete', {
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

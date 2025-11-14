export async function uploadImage(file: File, folder: string = 'community'): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Upload failed');
  }

  const data = await response.json();
  return { url: data.url };
}

const MAX_EDGE = 1920;
const WEBP_QUALITY = 0.82;

export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Niektóre przeglądarki nie dekodują np. HEIC. W takim przypadku
    // wysyłamy oryginał zamiast blokować dodanie auta.
    return file;
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Przeglądarka nie obsługuje kompresji zdjęć.');
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
    );
    if (!blob) throw new Error(`Nie udało się skompresować zdjęcia: ${file.name}`);

    // Dla małych, już zoptymalizowanych plików zachowujemy oryginał.
    if (blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'zdjecie';
    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}

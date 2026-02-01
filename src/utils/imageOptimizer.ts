import imageCompression from 'browser-image-compression';

/**
 * Optimiza una imagen para la web utilizando los estándares de la industria.
 * - Reduce el tamaño del archivo sin pérdida notable de calidad.
 * - Ajusta las dimensiones a un máximo recomendado para productos (1024px).
 * - Mantiene el aspect ratio original.
 */
export const optimizeImage = async (file: File, isSlider: boolean = false): Promise<File> => {
  const options = {
    maxSizeMB: isSlider ? 1.5 : 0.8, // Sliders necesitan más detalle por su tamaño
    maxWidthOrHeight: isSlider ? 1920 : 1024, // Full HD para sliders, 1024px para productos
    useWebWorker: true,
    initialQuality: isSlider ? 0.85 : 0.75, // Mayor calidad inicial para banners
    fileType: 'image/webp' as string,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Crear un nuevo archivo a partir del blob comprimido, manteniendo el nombre original pero con extensión .webp si cambió
    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressedBlob], fileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error optimizando la imagen:', error);
    // Si falla la optimización, devolvemos el archivo original para no interrumpir el flujo
    return file;
  }
};

/**
 * Optimiza múltiples imágenes en paralelo.
 */
export const optimizeImages = async (files: File[]): Promise<File[]> => {
  return Promise.all(files.map(file => optimizeImage(file)));
};

import imageCompression from 'browser-image-compression';

/**
 * Optimiza una imagen para la web utilizando los estándares de la industria.
 * - Reduce el tamaño del archivo sin pérdida notable de calidad.
 * - Ajusta las dimensiones a un máximo recomendado para productos (1024px).
 * - Mantiene el aspect ratio original.
 */
export const optimizeImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.8, // Tamaño máximo recomendado para carga ultra rápida
    maxWidthOrHeight: 1024, // Dimensión máxima estándar para webs modernas (Retina-ready)
    useWebWorker: true, // Usa hilos de fondo para no bloquear la interfaz de usuario
    initialQuality: 0.75, // Calidad optimizada para el equilibrio perfecto peso/nitidez
    fileType: 'image/webp' as string, // Forzar WebP por ser el estándar de la industria para rendimiento
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

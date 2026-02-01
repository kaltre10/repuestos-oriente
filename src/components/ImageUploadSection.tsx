import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTrash, FaTimes } from 'react-icons/fa';
import { imagesUrl } from '../utils/utils';
import { optimizeImages } from '../utils/imageOptimizer';

interface ImageUploadSectionProps {
  onImagesChange: (files: File[]) => void;
  existingImages?: { id: number; image: string }[];
  onDeleteExisting?: (imageId: number) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onImagesChange,
  existingImages = [],
  onDeleteExisting
}) => {

  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsOptimizing(true);
      try {
        const filesArray = Array.from(e.target.files);
        
        // Optimizar imágenes inmediatamente al cargar
        const optimizedFiles = await optimizeImages(filesArray);
        
        const newFiles = [...selectedFiles, ...optimizedFiles].slice(0, 5); // Limit to 5
        setSelectedFiles(newFiles);
        onImagesChange(newFiles);

        // Create previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
      } catch (error) {
        console.error("Error al procesar imágenes:", error);
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const removeNewImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onImagesChange(newFiles);

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imágenes del Producto (Máximo 5)
      </label>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Existing Images */}
        {existingImages.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img
              src={`${imagesUrl}${img.image}`}
              alt="Producto"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onDeleteExisting?.(img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}

        {/* New Previews */}
        {previews.map((preview, index) => (
          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-blue-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {(existingImages.length + selectedFiles.length) < 5 && (
          <label className={`flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all ${isOptimizing ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isOptimizing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            ) : (
              <>
                <FaCloudUploadAlt className="text-gray-400 text-2xl mb-1" />
                <span className="text-[10px] text-gray-500 text-center px-2">Subir Imagen</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isOptimizing}
            />
          </label>
        )}
      </div>
      <p className="text-[10px] text-gray-400 italic">
        {isOptimizing ? 'Optimizando imágenes para mejor rendimiento...' : 'Las imágenes se optimizan automáticamente al cargarlas.'}
      </p>
    </div>
  );
};

export default ImageUploadSection;

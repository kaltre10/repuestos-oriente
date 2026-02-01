import { useState, useCallback } from 'react';
import request from '../utils/request';
import { apiUrl } from '../utils/utils';
import axios from 'axios'
import { optimizeImages } from '../utils/imageOptimizer';

interface UseImageUploadReturn {
  uploading: boolean;
  optimizing: boolean;
  error: string | null;
  uploadImages: (productId: number, files: File[]) => Promise<any>;
  deleteImage: (imageId: number) => Promise<void>;
  fetchProductImages: (productId: number) => Promise<any[]>;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = useCallback(async (productId: number, files: File[]) => {
    setUploading(true);
    setError(null);
    try {
      // Optimizar imágenes antes de la subida
      setOptimizing(true);
      const optimizedFiles = await optimizeImages(files);
      setOptimizing(false);

      const formData = new FormData();
      formData.append('productId', productId.toString());
      optimizedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/images/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.body;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al subir las imágenes';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageId: number) => {
    setError(null);
    try {
      await request.delete(`${apiUrl}/images/${imageId}`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al eliminar la imagen';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, []);

  const fetchProductImages = useCallback(async (productId: number) => {
    setError(null);
    try {
      const response = await request.get(`${apiUrl}/images/product/${productId}`);
      return response.data.body;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al cargar las imágenes';
      setError(errMsg);
      return [];
    }
  }, []);

  return {
    uploading,
    optimizing,
    error,
    uploadImages,
    deleteImage,
    fetchProductImages,
  };
};

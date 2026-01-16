import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useBrands = () => {
  const {
    brands,
    loadingBrands: loading,
    errorBrands: error,
    fetchBrands,
    addBrand,
    updateBrand,
    deleteBrand
  } = useConfigStore();

  useEffect(() => {
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [brands.length, fetchBrands]);

  return {
    brands,
    loading,
    error,
    addBrand,
    updateBrand,
    deleteBrand,
    fetchBrands
  };
};

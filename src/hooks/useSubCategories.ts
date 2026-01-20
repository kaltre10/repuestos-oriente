import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useSubCategories = () => {
  const {
    subCategories,
    loadingSubCategories: loading,
    errorSubCategories: error,
    fetchSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useConfigStore();

  useEffect(() => {
    if (subCategories.length === 0) {
      fetchSubCategories();
    }
  }, [subCategories.length, fetchSubCategories]);

  return {
    subCategories,
    loading,
    error,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    fetchSubCategories
  };
};

import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useSubCategories = (onlyActive = false) => {
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
    fetchSubCategories(onlyActive);
  }, [fetchSubCategories, onlyActive]);

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

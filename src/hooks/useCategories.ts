import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useCategories = (onlyActive = false) => {
  const {
    categories,
    loadingCategories: loading,
    errorCategories: error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useConfigStore();

  useEffect(() => {
    fetchCategories(onlyActive);
  }, [fetchCategories, onlyActive]);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories
  };
};

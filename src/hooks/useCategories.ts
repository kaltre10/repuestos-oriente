import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useCategories = () => {
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
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

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

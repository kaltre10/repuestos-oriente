import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useModels = () => {
  const {
    models,
    loadingModels: loading,
    errorModels: error,
    fetchModels,
    addModel,
    updateModel,
    deleteModel
  } = useConfigStore();

  useEffect(() => {
    if (models.length === 0) {
      fetchModels();
    }
  }, [models.length, fetchModels]);

  return {
    models,
    loading,
    error,
    addModel,
    updateModel,
    deleteModel,
    fetchModels
  };
};

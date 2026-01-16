import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useDollarRate = () => {
  const {
    dollarRate,
    loadingDollar: loading,
    errorDollar: error,
    fetchDollarRate,
    saveDollarRate,
    setLocalDollarRate: setDollarRate
  } = useConfigStore();

  useEffect(() => {
    // Solo fetch si la tasa es '0' (no cargada aún)
    if (dollarRate === '0') {
      fetchDollarRate();
    }
  }, [dollarRate, fetchDollarRate]);

  return {
    dollarRate,
    setDollarRate,
    loading,
    error,
    saveDollarRate,
    fetchDollarRate
  };
};

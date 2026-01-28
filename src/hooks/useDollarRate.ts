import { useEffect } from 'react';
import { useConfigStore } from '../states/useConfigStore';

export const useDollarRate = () => {
  const {
    dollarRate,
    freeShippingThreshold,
    shippingPrice,
    loadingDollar: loading,
    errorDollar: error,
    fetchDollarRate,
    saveConfig,
    setLocalDollarRate: setDollarRate,
    setLocalFreeShippingThreshold,
    setLocalShippingPrice
  } = useConfigStore();

  useEffect(() => {
    // Solo fetch si la tasa es '0' (no cargada aún)
    if (dollarRate === '0') {
      fetchDollarRate();
    }
  }, [dollarRate, fetchDollarRate]);

  return {
    dollarRate,
    freeShippingThreshold,
    shippingPrice,
    setDollarRate,
    setLocalFreeShippingThreshold,
    setLocalShippingPrice,
    loading,
    error,
    saveConfig,
    fetchDollarRate
  };
};

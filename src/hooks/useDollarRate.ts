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
    // Fetch dollar rate and shipping price on every mount
    // This ensures we always have the latest values from the server
    fetchDollarRate();
  }, [fetchDollarRate]);

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

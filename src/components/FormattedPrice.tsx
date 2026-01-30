import React from 'react';
import useStore from '../states/global';
import { useDollarRate } from '../hooks/useDollarRate';

interface FormattedPriceProps {
  price: number;
  className?: string;
}

const FormattedPrice: React.FC<FormattedPriceProps> = ({ price, className = "" }) => {
  const { currency } = useStore();
  const { dollarRate } = useDollarRate();

  /* console.log("FormattedPrice - currency:", currency, "dollarRate:", dollarRate); */
  const formattedPrice = React.useMemo(() => {
    const numericPrice = Number(price);
    const numericRate = Number(dollarRate);

    if (currency === 'BS') {
      const priceInBs = numericPrice * numericRate;
      return `${priceInBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    }

    return `$${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [price, currency, dollarRate]);

  return <span className={className}>{formattedPrice}</span>;
};

export default FormattedPrice;

import React from 'react';
import Hero from '../../components/Hero';
import BestSellers from '../../components/BestSellers';
import CartModal from '../../components/CartModal';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <BestSellers />
      <CartModal />
    </>
  );
};

export default HomePage;

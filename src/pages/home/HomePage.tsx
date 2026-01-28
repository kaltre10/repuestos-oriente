import React, { useEffect } from 'react';
import Hero from '../../components/Hero';
import BestSellers from '../../components/BestSellers';
import CartModal from '../../components/CartModal';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Repuestos Picha - Inicio";
    const recordVisit = async () => {
      try {
        await request.post(`${apiUrl}/visits`, { path: '/' });
      } catch (error) {
        console.error('Error recording visit:', error);
      }
    };
    recordVisit();
  }, []);

  return (
    <>
      <Hero />
      <BestSellers />
      <CartModal />
    </>
  );
};

export default HomePage;

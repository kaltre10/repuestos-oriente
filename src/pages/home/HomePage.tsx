import React, { useEffect } from 'react';
// import HeaderNew from '../../components/HeaderNew';
import Hero from '../../components/Hero';
import BestSellers from '../../components/BestSellers';
import CartModal from '../../components/CartModal';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import SEO from '../../components/SEO';

const HomePage: React.FC = () => {
  useEffect(() => {
    const recordVisit = async () => {
      try {
        await request.post(`${apiUrl}/visits`, { path: '/' });
      } catch (error) {
        console.error('Error recording visit:', error);
      }
    };
    recordVisit();
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": "Repuestos Picha",
    "description": "Venta de repuestos para carros en Venezuela. Encuentra las mejores marcas y precios para tu vehículo.",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "VE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "VE",
      "availableLanguage": "Spanish"
    }
  };

  return (
    <>
      <SEO 
        title="Inicio" 
        description="Repuestos Picha es tu tienda de confianza para repuestos de autos en Venezuela. Ofrecemos una amplia gama de autopartes para todas las marcas."
        structuredData={organizationSchema}
      />
      <Hero />
      <BestSellers />
      <CartModal />
    </>
  );
};

export default HomePage;

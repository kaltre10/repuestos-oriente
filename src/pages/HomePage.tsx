import React from 'react';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import Header from '../components/Header';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';
// import CategoryIcons from '../components/CategoryIcons';
// import FlashSale from '../components/FlashSale';
// import CarWashing from '../components/CarWashing';
// import FeaturedBrands from '../components/FeaturedBrands';
// import ProductList from '../components/ProductList';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <BestSellers />
      <CartModal />
      <Footer />
    </>
  );
};

export default HomePage;

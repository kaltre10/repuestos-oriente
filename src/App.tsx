import React from 'react';
import Router from './pages/Router';
import useNotify from './hooks/useNotify';
import { GlobalConfirmModal } from './components/modals/GlobalConfirmModal';
// import ScrollToTop from './components/ScrollToTop';
import AdvertisingModal from './components/AdvertisingModal';
import WhatsAppButton from './components/WhatsAppButton';
import HeaderNew from "./components/HeaderNew";
import MobileBottomNav from './components/MobileBottomNav';
import Footer from "./components/Footer";
const App: React.FC = () => {

  const { ToastContainer } = useNotify()
  return <>
    <AdvertisingModal />
    {/* <ScrollToTop /> */}
    <WhatsAppButton />
    <GlobalConfirmModal />
    <ToastContainer theme="dark" />
    <MobileBottomNav />
    <HeaderNew />
    <Router />
    <Footer />
  </>
};

export default App;

import React from 'react';
import Router from './pages/Router';
import useNotify from './hooks/useNotify';
import { GlobalConfirmModal } from './components/modals/GlobalConfirmModal';
// import ScrollToTop from './components/ScrollToTop';
import AdvertisingModal from './components/AdvertisingModal';
import WhatsAppButton from './components/WhatsAppButton';
import SEO from './components/SEO';

const App: React.FC = () => {
  const { ToastContainer } = useNotify()
  return (
    <>
      <SEO />
      <AdvertisingModal />
      {/* <ScrollToTop /> */}
      <WhatsAppButton />
      <GlobalConfirmModal />
      <ToastContainer theme="dark" />
      <Router />
    </>
  )
};

export default App;

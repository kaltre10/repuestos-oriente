import React from 'react';
import Router from './pages/Router';
import useNotify from './hooks/useNotify';
import { GlobalConfirmModal } from './components/modals/GlobalConfirmModal';
import ScrollToTop from './components/ScrollToTop';
import AdvertisingModal from './components/AdvertisingModal';
import MobileBottomNav from './components/MobileBottomNav';

const App: React.FC = () => {

  const { ToastContainer } = useNotify()

  return <>
    <AdvertisingModal />
    <ScrollToTop />
    <GlobalConfirmModal />
    <ToastContainer theme="dark" />
    <Router />
    <MobileBottomNav />
  </>
};

export default App;

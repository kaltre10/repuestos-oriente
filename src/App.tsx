import React from 'react';
import Router from './pages/Router';
import useNotify from './hooks/useNotify';
import { GlobalConfirmModal } from './components/modals/GlobalConfirmModal';

const App: React.FC = () => {

  const { ToastContainer } = useNotify()

  return <>
    <GlobalConfirmModal />
    <ToastContainer theme="dark" />
    <Router />
  </>
};

export default App;

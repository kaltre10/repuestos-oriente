import React from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
// import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HomePage />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default App;

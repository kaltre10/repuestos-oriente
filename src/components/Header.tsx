import { Search, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../states/global';

import TopBanner from './TopBanner';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartCount, toggleCart, user } = useStore();

  return (
    <header className="bg-gray-200 text-gray-800 top-0 left-0 right-0 z-50 shadow-md">
      {/* Top Banner */}
      <TopBanner />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1">
          <div className="text-3xl font-bold text-gray-800 flex items-center">
            <Link to="/" className="flex items-center">
              <img className='logo rounded-full bg-red-500' src="./logo.png" alt="" />
              <span className="hidden lg:inline"><span className="text-red-500">REPUESTOS</span>PICHA</span>
            </Link>
          </div>
          <div className="hidden lg:flex flex-1 mx-8 max-w-3xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Escribe lo que buscas...."
                className="w-full bg-white text-black rounded-full py-3 pl-6 pr-12 focus:outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to={user ? "/clients/purchases" : "/auth"} className="hover:text-red-500 transition-colors">
              <User size={24} />
            </Link>
            <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </button>
          </div>

          {/* Mobile Header Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-red-500 transition-colors">
              <Search size={24} />
            </button>
            <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top duration-300">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Escribe lo que buscas...."
                className="w-full bg-white text-black rounded-full py-2.5 pl-5 pr-12 focus:outline-none shadow-sm border border-gray-200"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Bottom Bar - Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center h-10">
          <nav className="flex items-center space-x-8">
            <Link to="/" className="hover:text-red-500 transition-colors">INICIO</Link>
            <Link to="/productos" className="hover:text-red-500 transition-colors">PRODUCTOS</Link>
            <Link to="/ofertas" className="hover:text-red-500 transition-colors">OFERTAS</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

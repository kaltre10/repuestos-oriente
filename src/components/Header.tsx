import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../states/global';
import TopBanner from './TopBanner';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount, toggleCart, user } = useStore();

  return (
    <header className="bg-white text-gray-800 top-0 left-0 right-0 z-50 shadow-sm">
      {/* Top Banner */}
      <TopBanner />
      
      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row - Logo, Search, Icons */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img className='logo h-12 w-12 rounded-full bg-red-500 object-cover' src="./logo.png" alt="Repuestos Picha" />
            <span className="text-2xl font-black text-gray-900">
              <span className="text-red-600">REPUESTOS</span>PICHA
            </span>
          </Link>
          
          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Busca repuestos para tu vehículo..."
                className="w-full bg-gray-50 text-gray-900 rounded-full py-3 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm border border-gray-200"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="md:hidden hover:text-red-600 transition-colors"
            >
              <Search size={22} />
            </button>
            
            {/* User Icon */}
            <Link 
              to={user ? "/clients/purchases" : "/auth"} 
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <User size={20} />
            </Link>
            
            {/* Cart Button */}
            <button 
              onClick={toggleCart} 
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden hover:text-red-600 transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-in slide-in-from-top duration-300">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Busca repuestos para tu vehículo..."
                className="w-full bg-gray-50 text-gray-900 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm border border-gray-200"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="hidden md:block">
          <nav className="flex items-center justify-center h-12 space-x-10">
            <Link 
              to="/" 
              className="text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors relative group"
            >
              INICIO
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/productos" 
              className="text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors relative group"
            >
              PRODUCTOS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/ofertas" 
              className="text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors relative group"
            >
              OFERTAS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
              >
                INICIO
              </Link>
              <Link 
                to="/productos" 
                className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
              >
                PRODUCTOS
              </Link>
              <Link 
                to="/ofertas" 
                className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
              >
                OFERTAS
              </Link>
              <Link 
                to={user ? "/clients/purchases" : "/auth"} 
                className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
              >
                MI CUENTA
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
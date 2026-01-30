import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../states/global';
import TopBanner from './TopBanner';

const HeaderNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { getCartCount, toggleCart, user } = useStore();
  const location = useLocation();
  
  // Función para verificar si una ruta está activa
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white text-gray-800 top-0 left-0 right-0 z-50 shadow-sm">
      {/* Top Banner */}
      <TopBanner />
      
      {/* Main Header Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row - Branding and Quick Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between py-2 gap-1">
          {/* Branding */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              className='logo h-14 w-14 rounded-full bg-red-500 object-cover shadow-md' 
              src="./logo.png" 
              alt="Repuestos Picha" 
            />
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              <span className="text-red-600">REPUESTOS</span>PICHA
            </span>
          </Link>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)} 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
            
            {/* User Profile */}
            <Link 
              to={user ? "/clients/purchases" : "/auth"} 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              aria-label="Mi cuenta"
            >
              <User size={20} />
            </Link>
            
            {/* Shopping Cart */}
            <button 
              onClick={toggleCart} 
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                {getCartCount()}
              </span>
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              aria-label="Menú"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSearchExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="relative w-full p-1">
            <input
              type="text"
              placeholder="Busca repuestos para tu vehículo..."
              className="w-full bg-gray-50 text-gray-900 rounded-full py-3 pl-6 pr-12 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm"
              autoFocus
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block py-2">
          <nav className="flex items-center justify-center bg-gradient-to-r from-red-50 to-gray-50 rounded-full p-1 shadow-sm gap-2">
            <Link 
              to="/" 
              className={`py-1 px-8 text-center font-semibold rounded-full transition-all duration-300 ${isActive('/') ? 'text-gray-900 bg-white shadow-md' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              INICIO
            </Link>
            <Link 
              to="/productos" 
              className={`py-1 px-8 text-center font-semibold rounded-full transition-all duration-300 ${isActive('/productos') ? 'text-gray-900 bg-white shadow-md' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              PRODUCTOS
            </Link>
            <Link 
              to="/ofertas" 
              className={`py-1 px-8 text-center font-semibold rounded-full transition-all duration-300 ${isActive('/ofertas') ? 'text-gray-900 bg-white shadow-md' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              OFERTAS
            </Link>
            <Link 
              to="/ayuda-soporte" 
              className={`py-1 px-8 text-center font-semibold rounded-full transition-all duration-300 ${isActive('/ayuda-soporte') ? 'text-gray-900 bg-white shadow-md' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              AYUDA
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col bg-gray-50 rounded-xl p-4 shadow-lg mb-1">
            <Link 
              to="/" 
              className={`py-3 px-5 font-semibold rounded-lg mb-2 transition-all duration-200 ${isActive('/') ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              INICIO
            </Link>
            <Link 
              to="/productos" 
              className={`py-3 px-5 font-semibold rounded-lg mb-2 transition-all duration-200 ${isActive('/productos') ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              PRODUCTOS
            </Link>
            <Link 
              to="/ofertas" 
              className={`py-3 px-5 font-semibold rounded-lg mb-2 transition-all duration-200 ${isActive('/ofertas') ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              OFERTAS
            </Link>
            <Link 
              to="/ayuda-soporte" 
              className={`py-3 px-5 font-semibold rounded-lg mb-2 transition-all duration-200 ${isActive('/ayuda-soporte') ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              AYUDA
            </Link>
            <Link 
              to={user ? "/clients/purchases" : "/auth"} 
              className={`py-3 px-5 font-semibold rounded-lg transition-all duration-200 ${(user && isActive('/clients')) || (!user && isActive('/auth')) ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-700 hover:text-red-600 hover:bg-white'}`}
            >
              MI CUENTA
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderNew;
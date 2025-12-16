import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
/* import { Heart} from 'lucide-react'; */
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-200 text-gray-800 top-0 left-0 right-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-gray-100 text-gray-800 text-sm py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span>Envío gratis a partir de $20</span>
          <span>Precio del dólar BCV: 275 Bs</span>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="text-3xl font-bold text-gray-800">
            <span className="text-red-500">REPUESTOS</span>ORIENTE
          </div>
          <div className="hidden lg:flex flex-1 mx-8 max-w-3xl">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Escribe lo que buscas..." 
                className="w-full bg-white text-black rounded-full py-3 pl-6 pr-12 focus:outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className="hover:text-red-500 transition-colors">
              <User size={24} />
            </a>
            <a href="#" className="relative hover:text-red-500 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Bottom Bar - Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center h-12">
          <nav className="flex items-center space-x-8">
            {/* <a href="#" className="hover:text-red-500 transition-colors">INICIO</a> */}
            <a href="#" className="hover:text-red-500 transition-colors">COLECCIONES</a>
            <a href="#" className="hover:text-red-500 transition-colors">PRODUCTOS</a>
            <a href="#" className="hover:text-red-500 transition-colors">OFERTAS</a>
            <a href="#" className="hover:text-red-500 transition-colors">BLOG</a>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="mt-8 mx-auto max-w-sm">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Escribe lo que buscas..."
                className="w-full bg-white text-black rounded-full py-3 pl-6 pr-12 focus:outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
          <nav className="flex flex-col items-center space-y-6 text-lg mt-8">
            {/* <a href="#" className="hover:text-red-500 transition-colors">INICIO</a> */}
            <a href="#" className="hover:text-red-500 transition-colors">COLECCIONES</a>
            <a href="#" className="hover:text-red-500 transition-colors">PRODUCTOS</a>
            <a href="#" className="hover:text-red-500 transition-colors">OFERTAS</a>
            <a href="#" className="hover:text-red-500 transition-colors">BLOG</a>
          </nav>
          <div className="flex justify-center items-center space-x-8 mt-8">
            <a href="#" className="hover:text-red-500 transition-colors">
              <User size={24} />
            </a>
            <a href="#" className="relative hover:text-red-500 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
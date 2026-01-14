import { Search, User, ShoppingCart, Menu, X, Truck } from 'lucide-react';
/* import { Heart} from 'lucide-react'; */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../states/global';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount, toggleCart } = useStore();

  return (
    <header className="bg-gray-200 text-gray-800 top-0 left-0 right-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-gray-100 text-gray-800 text-sm py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Truck size={16} />
            Envío gratis a partir de $20
          </span>
          <span className="flex items-center gap-2">
            <img
              src="https://flagcdn.com/w40/ve.png"
              srcSet="https://flagcdn.com/w80/ve.png 2x"
              width="25"
              alt="Venezuela"></img>
            Precio del dólar BCV: 275 Bs
          </span>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="text-3xl font-bold text-gray-800 flex items-center">
            <img className='logo' src="./logo.png" alt="" />
            <span className="text-red-500">REPUESTOS</span>PICHA
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
            <a href="#" className="hover:text-red-500 transition-colors">
              <User size={24} />
            </a>
            <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </button>
          </div>

          {/* Mobile Header Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Bottom Bar - Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center h-12">
          <nav className="flex items-center space-x-8">
            <Link to="/" className="hover:text-red-500 transition-colors">INICIO</Link>
            <Link to="/productos" className="hover:text-red-500 transition-colors">PRODUCTOS</Link>
            <Link to="/ofertas" className="hover:text-red-500 transition-colors">OFERTAS</Link>
          </nav>
        </div>
      </div>


      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`bg-gray-100 menu-mobile p-5 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
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
              <Link to="/" className="hover:text-red-500 transition-colors">INICIO</Link>
              <Link to="/productos" className="hover:text-red-500 transition-colors">PRODUCTOS</Link>
              <Link to="/ofertas" className="hover:text-red-500 transition-colors">OFERTAS</Link>
            </nav>
            <div className="flex justify-center items-center space-x-8 mt-8">
              <a href="#" className="hover:text-red-500 transition-colors">
                <User size={24} />
              </a>
              <button onClick={toggleCart} className="relative hover:text-red-500 transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              </button>
            </div>
          </div>
        </div>)}

    </header>
  );
};

export default Header;

import { Search, User, ShoppingCart, Truck } from 'lucide-react';
/* import { Heart} from 'lucide-react'; */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../states/global';
import { useDollarRate } from '../hooks/useDollarRate';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartCount, toggleCart, user, currency, setCurrency } = useStore();
  const { dollarRate } = useDollarRate();

  return (
    <header className="bg-gray-200 text-gray-800 top-0 left-0 right-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-gray-100 text-gray-800 text-sm py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Truck size={16} />
            Envío gratis a partir de $20
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <img
                src="https://flagcdn.com/w40/ve.png"
                srcSet="https://flagcdn.com/w80/ve.png 2x"
                width="25"
                alt="Venezuela"></img>
                {/* Texto visible en desktop, oculto en móvil */}
                <span className="hidden sm:inline">Precio del dólar BCV:</span>
                {/* El valor siempre visible */}
                <span className="font-semibold">{Number(dollarRate).toFixed(2)} Bs</span>
            </span>
            <div className="flex items-center bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  currency === 'USD'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('BS')}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  currency === 'BS'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                BS
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="text-3xl font-bold text-gray-800 flex items-center">
            <Link to="/" className="flex items-center">
              <img className='logo' src="./logo.png" alt="" />
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
        <div className="hidden lg:flex items-center justify-center h-12">
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

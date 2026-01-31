import { Search, User, ShoppingCart, Menu, X, Package, MapPin as MapPinLucide } from 'lucide-react';
import { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useStore from '../states/global';
import TopBanner from './TopBanner';
import { useProducts } from '../hooks/useProducts';
import { imagesUrl, apiUrl } from '../utils/utils';
import FormattedPrice from './FormattedPrice';
import request from '../utils/request';

// Componentes memoizados individualmente
const SearchToggleButton = memo(({ 
  // isSearchExpanded, 
  onClick 
}: { 
  isSearchExpanded: boolean; 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick} 
    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
    aria-label="Buscar"
  >
    <Search size={20} />
  </button>
));

const UserProfileButton = memo(({ 
  user 
}: { 
  user: any 
}) => (
  <Link 
    to={user ? "/clients/purchases" : "/auth"} 
    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
    aria-label="Mi cuenta"
  >
    <User size={20} />
  </Link>
));

const CartButton = memo(({ 
  cartCount, 
  onToggleCart 
}: { 
  cartCount: number; 
  onToggleCart: () => void 
}) => (
  <button 
    onClick={onToggleCart} 
    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
    aria-label="Carrito"
  >
    <ShoppingCart size={20} />
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
      {cartCount}
    </span>
  </button>
));

const MobileMenuButton = memo(({ 
  isMenuOpen, 
  onToggleMenu 
}: { 
  isMenuOpen: boolean; 
  onToggleMenu: () => void 
}) => (
  <button 
    onClick={onToggleMenu} 
    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
    aria-label="Menú"
  >
    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
  </button>
));

const SearchBar = memo(({ 
  isSearchExpanded 
}: { 
  isSearchExpanded: boolean 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { getProducts } = useProducts();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Usamos apiUrl importado para asegurar que la ruta sea correcta
      const url = `${apiUrl}/products?search=${searchTerm}&limit=5`;
      const response = await request.get(url);
      
      if (response && response.data && response.data.body && response.data.body.products) {
        setResults(response.data.body.products);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (query.length >= 2) {
      setShowResults(true);
      timeoutRef.current = setTimeout(() => {
        handleSearch(query);
      }, 500);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/producto/${productId}`);
    setShowResults(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={searchRef} className={`transition-all duration-500 ease-in-out relative ${isSearchExpanded ? 'opacity-100 mb-4 h-auto' : 'h-0 opacity-0 overflow-hidden'}`}>
      <div className="relative w-full p-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Busca repuestos para tu vehículo..."
          className="w-full bg-gray-50 text-gray-900 rounded-full py-3.5 pl-6 pr-12 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm"
          autoFocus={isSearchExpanded}
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

        {/* Resultados del Buscador */}
        {showResults && (
          <div className="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 text-gray-500 font-bold">
                  <div className="w-5 h-5 border-3 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                  Buscando productos...
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={product.images?.[0]?.image ? `${imagesUrl}${product.images[0].image}` : '/placeholder-product.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = '/placeholder-product.svg')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate uppercase">{product.name}</h4>
                      <p className="text-xs text-gray-500 font-bold">{product.categories}</p>
                    </div>
                    <div className="text-right">
                      <FormattedPrice 
                        price={product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price} 
                        className="text-sm font-black text-red-600"
                      />
                    </div>
                  </div>
                ))}
                <Link 
                  to={`/productos?search=${query}`}
                  onClick={() => {
                    setShowResults(false);
                    setQuery('');
                    setResults([]);
                  }}
                  className="block p-3 text-center text-xs font-black text-gray-500 hover:bg-gray-50 border-t border-gray-100 uppercase tracking-widest"
                >
                  Ver todos los resultados
                </Link>
              </div>
            ) : query.length >= 2 ? (
              <div className="p-6 text-center text-gray-500 font-bold">
                No encontramos productos que coincidan con tu búsqueda
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});

// Componente para enlaces de navegación
const NavLink = memo(({ 
  to, 
  label, 
  isActive,
  mobile = false
}: { 
  to: string; 
  label: string; 
  isActive: boolean;
  mobile?: boolean;
}) => {
  const baseClasses = mobile 
    ? 'py-3 px-5 font-semibold rounded-lg mb-2 transition-all duration-200'
    : 'py-1 px-8 text-center font-semibold rounded-full transition-all duration-300';
  
  const activeClasses = mobile
    ? 'text-gray-900 bg-white shadow-sm'
    : 'text-gray-900 bg-white shadow-md';
  
  const inactiveClasses = mobile
    ? 'text-gray-700 hover:text-red-600 hover:bg-white'
    : 'text-gray-700 hover:text-red-600 hover:bg-white';
  
  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </Link>
  );
});

const DesktopNavigation = memo(({ 
  isActive 
}: { 
  isActive: (path: string) => boolean 
}) => (
  <div className="hidden md:block py-2">
    <nav className="flex items-center justify-center bg-gradient-to-r from-red-50 to-gray-50 rounded-full p-1 shadow-sm gap-2">
      <NavLink to="/" label="INICIO" isActive={isActive('/')} />
      <NavLink to="/productos" label="PRODUCTOS" isActive={isActive('/productos')} />
      <NavLink to="/ofertas" label="OFERTAS" isActive={isActive('/ofertas')} />
      <NavLink to="/ayuda-soporte" label="AYUDA" isActive={isActive('/ayuda-soporte')} />
    </nav>
  </div>
));

const MobileNavigation = memo(({ 
  isMenuOpen, 
  isActive, 
  user 
}: { 
  isMenuOpen: boolean; 
  isActive: (path: string) => boolean; 
  user: any 
}) => (
  <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
    <nav className="flex flex-col bg-gray-50 rounded-xl p-4 shadow-lg mb-1">
      <NavLink to="/" label="INICIO" isActive={isActive('/')} mobile />
      <NavLink to="/productos" label="PRODUCTOS" isActive={isActive('/productos')} mobile />
      <NavLink to="/ofertas" label="OFERTAS" isActive={isActive('/ofertas')} mobile />
      <NavLink to="/ayuda-soporte" label="AYUDA" isActive={isActive('/ayuda-soporte')} mobile />
      <NavLink 
        to={user ? "/clients/purchases" : "/auth"} 
        label="MI CUENTA" 
        isActive={(user && isActive('/clients')) || (!user && isActive('/auth'))} 
        mobile 
      />
    </nav>
  </div>
));

const HeaderNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // Solo suscribirse a las partes necesarias del store
  const cartCount = useStore(state => {
    // Calcular el count directamente aquí para evitar llamadas a función
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  });
  const toggleCart = useStore(state => state.toggleCart);
  const user = useStore(state => state.user);
  
  const location = useLocation();
  
  // Memoizar la función isActive
  const isActive = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);
  
  // Handlers memoizados
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const toggleSearch = useCallback(() => setIsSearchExpanded(prev => !prev), []);
  
  // Memoizar el logo y branding para evitar re-creación
  const branding = useMemo(() => (
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
  ), []);
  
  return (
    <header className="bg-white text-gray-800 top-0 left-0 right-0 z-50 shadow-sm">
      {/* Top Banner */}
      <TopBanner />
      
      {/* Main Header Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row - Branding and Quick Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between py-2 gap-1">
          {/* Branding */}
          {branding}
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <SearchToggleButton 
              isSearchExpanded={isSearchExpanded} 
              onClick={toggleSearch} 
            />
            
            <UserProfileButton user={user} />
            
            <CartButton 
              cartCount={cartCount} 
              onToggleCart={toggleCart} 
            />
            
            <MobileMenuButton 
              isMenuOpen={isMenuOpen} 
              onToggleMenu={toggleMenu} 
            />
          </div>
        </div>
        
        {/* Search Bar */}
        <SearchBar isSearchExpanded={isSearchExpanded} />
        
        {/* Desktop Navigation */}
        <DesktopNavigation isActive={isActive} />
        
        {/* Mobile Navigation */}
        <MobileNavigation 
          isMenuOpen={isMenuOpen} 
          isActive={isActive} 
          user={user} 
        />
      </div>
    </header>
  );
};

export default memo(HeaderNew);
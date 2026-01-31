import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useState, memo, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../states/global';
import TopBanner from './TopBanner';

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
}) => (
  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSearchExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
    <div className="relative w-full p-1">
      <input
        type="text"
        placeholder="Busca repuestos para tu vehículo..."
        className="w-full bg-gray-50 text-gray-900 rounded-full py-3 pl-6 pr-12 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm"
        autoFocus={isSearchExpanded}
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  </div>
));

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
import { Home, ShoppingBag, Tag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../states/global';
import { memo, useMemo } from 'react';

const MobileBottomNav = () => {  
  const location = useLocation();
  // Solo suscribirse a la parte del estado que necesitas
  const user = useStore(state => state.user);
  
  // Memoizar la función isActive
  const isActive = useMemo(() => (path: string) => location.pathname === path, [location.pathname]);
  
  return (
    <nav className="nav-mobile lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <NavLink to="/" icon={Home} label="Inicio" isActive={isActive('/')} />
        <NavLink to="/productos" icon={ShoppingBag} label="Productos" isActive={isActive('/productos')} />
        <NavLink to="/ofertas" icon={Tag} label="Ofertas" isActive={isActive('/ofertas')} />
        <NavLink 
          to={user ? "/clients/purchases" : "/auth"} 
          icon={User} 
          label="Perfil" 
          isActive={isActive('/clients/purchases') || isActive('/auth')} 
        />
      </div>
    </nav>
  );
};

// Componente interno memoizado
const NavLink = memo(({ 
  to, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  to: string; 
  icon: any; 
  label: string; 
  isActive: boolean; 
}) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center gap-1 transition-colors ${
      isActive ? 'text-red-500' : 'text-gray-500'
    }`}
  >
    <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </Link>
));

NavLink.displayName = 'NavLink';

export default memo(MobileBottomNav);
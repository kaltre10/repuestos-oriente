import { Home, ShoppingBag, Tag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../states/global';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav-mobile lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive('/') ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <Home size={28} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
        </Link>

        <Link 
          to="/productos" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive('/productos') ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <ShoppingBag size={28} strokeWidth={isActive('/productos') ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Productos</span>
        </Link>

        <Link 
          to="/ofertas" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive('/ofertas') ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <Tag size={28} strokeWidth={isActive('/ofertas') ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Ofertas</span>
        </Link>

        <Link 
          to={user ? "/clients/purchases" : "/auth"} 
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive('/clients/purchases') || isActive('/auth') ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <User size={28} strokeWidth={isActive('/clients/purchases') || isActive('/auth') ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

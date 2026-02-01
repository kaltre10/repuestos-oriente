import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaCreditCard, FaSignOutAlt, FaHome, FaQuestionCircle, FaEnvelope, FaTimes } from 'react-icons/fa';
import useStore from '../states/global';

interface ClientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClientSidebar = ({ isOpen, onClose }: ClientSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/clients/purchases', icon: <FaShoppingBag className="mr-3" />, label: 'Compras' },
    { path: '/clients/profile', icon: <FaUser className="mr-3" />, label: 'Perfil' },
    { path: '/clients/payments', icon: <FaCreditCard className="mr-3" />, label: 'Métodos de Pago' },
    { path: '/clients/questions', icon: <FaQuestionCircle className="mr-3" />, label: 'Preguntas' },
    { path: '/clients/contact', icon: <FaEnvelope className="mr-3" />, label: 'Contacto' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl h-screen flex flex-col border-r border-gray-100
        transition-transform duration-300 ease-in-out h-screen 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <FaUser size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm truncate w-32">
                {user?.name || 'Cliente'}
              </h2>
              <p className="text-xs text-gray-500">Área de Clientes</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4">
          <Link
            to="/"
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            <FaHome className="mr-3" />
            Volver a la Tienda
          </Link>
          
          <div className="my-2 border-t border-gray-50"></div>

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`flex items-center px-6 py-3 transition-all ${
                isActive(item.path)
                  ? 'bg-red-50 text-red-600 border-r-4 border-red-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg cursor-pointer"
          >
            <FaSignOutAlt className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientSidebar;

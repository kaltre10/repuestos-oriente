import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUsers, FaBox, FaChartLine, FaCog, FaDollarSign, FaSignOutAlt, FaQuestionCircle, FaCreditCard, FaSlidersH } from 'react-icons/fa';
import { useDollarRate } from '../hooks/useDollarRate';
import useStore from '../states/global';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dollarRate } = useDollarRate();
  const { logout, currency, setCurrency } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const routes = [
    { path: '/admin/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Usuarios' },
    { path: '/admin/sliders', icon: <FaSlidersH />, label: 'Sliders' },
    { path: '/admin/products', icon: <FaBox />, label: 'Productos' },
    { path: '/admin/sales', icon: <FaChartLine />, label: 'Ventas' },
    { path: '/admin/client-questions', icon: <FaQuestionCircle />, label: 'Preguntas' },
    { path: '/admin/payment-methods', icon: <FaCreditCard />, label: 'Métodos de Pago' },
    { path: '/admin/configurations', icon: <FaCog />, label: 'Configuraciones' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="w-64 bg-black shadow-lg h-screen overflow-y-auto">
      <div className="p-6 text-center border-b border-gray-800">
        <h1 className="font-bold text-gray-200 text-xl mb-2">Administrativo</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center text-green-500 bg-green-500/10 py-2 px-3 rounded-lg border border-green-500/20">
            <FaDollarSign className="mr-1 text-xs" />
            <span className="text-xs font-medium uppercase mr-1">Tasa del día:</span>
            <span className="text-sm font-bold">Bs. {dollarRate}</span>
          </div>
          
          <div className="flex items-center justify-center bg-gray-900 rounded-full p-0.5 border border-gray-700">
            <button
              onClick={() => setCurrency('USD')}
              className={`flex-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                currency === 'USD'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('BS')}
              className={`flex-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                currency === 'BS'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              BS
            </button>
          </div>
        </div>
      </div>
      <nav className="mt-6">
        {routes.map((i, index) => {
          return <Link
          key={index}
            to={i.path}
            className={`flex items-center px-6 py-3 ${isActive(i.path) || isActive('/admin')
              ? 'bg-gray-900 text-white border-r-4 border-blue-500'
              : 'text-gray-300 hover:bg-gray-900 hover:text-gray-100'
              }`}
          >
            <div className='flex items-center gap-3'>
              {i.icon} {i.label}
            </div>
          </Link>
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 mt-4 text-red-400 hover:bg-gray-900 hover:text-red-300 transition-colors cursor-pointer"
        >
          <FaSignOutAlt className="mr-3" />
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;

import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaBox, FaChartLine, FaCog } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <div className="w-64 bg-black shadow-lg">
      <div className="p-6 text-center">
        <h1 className="font-bold text-gray-200">Administrativo</h1>
      </div>
      <nav className="mt-6">
        <Link
          to="/admin/users"
          className={`flex items-center px-6 py-3 ${
            isActive('/admin/users') || isActive('/admin')
              ? 'bg-gray-900 text-white border-r-4 border-blue-500'
              : 'text-gray-300 hover:bg-gray-900 hover:text-gray-100'
          }`}
        >
          <FaUsers className="mr-3" />
          Usuarios
        </Link>
        <Link
          to="/admin/products"
          className={`flex items-center px-6 py-3 ${
            isActive('/admin/products')
              ? 'bg-gray-900 text-white border-r-4 border-blue-500'
              : 'text-gray-300 hover:bg-gray-900 hover:text-gray-100'
          }`}
        >
          <FaBox className="mr-3" />
          Productos
        </Link>
        <Link
          to="/admin/sales"
          className={`flex items-center px-6 py-3 ${
            isActive('/admin/sales')
              ? 'bg-gray-900 text-white border-r-4 border-blue-500'
              : 'text-gray-300 hover:bg-gray-900 hover:text-gray-100'
          }`}
        >
          <FaChartLine className="mr-3" />
          Ventas
        </Link>
        <Link
          to="/admin/configurations"
          className={`flex items-center px-6 py-3 ${
            isActive('/admin/configurations')
              ? 'bg-gray-900 text-white border-r-4 border-blue-500'
              : 'text-gray-300 hover:bg-gray-900 hover:text-gray-100'
          }`}
        >
          <FaCog className="mr-3" />
          Configuraciones
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;

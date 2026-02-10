import { Link } from 'react-router-dom';
import { Home, User, CheckCircle } from 'lucide-react';
import useStore from '../states/global';
import logo from '../assets/logo.png';

const AuthPageSuccess = () => {
  const { user } = useStore();

  const profileLink = user?.role === 'admin' ? '/admin/dashboard' : '/clients/profile';

  return (
    <div className="h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="bg-logo py-4 px-8 border-b border-gray-100 flex justify-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            </Link>
          </div>
          
          <div className="px-8 py-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              ¡Ya has iniciado sesión!
            </h2>
            
            <p className="text-sm text-gray-600 mb-8">
              Hola, <span className="font-bold text-gray-900">{user?.name}</span>. 
              Parece que ya te encuentras registrado y autenticado en nuestra plataforma.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red hover:bg-red-700 transition-all shadow-sm"
              >
                <Home size={18} />
                Ir al Inicio
              </Link>
              
              <Link
                to={profileLink}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
              >
                <User size={18} />
                Ir a mi Perfil
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              Repuestos Picha - Marketplace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageSuccess;

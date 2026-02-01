import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        {/* Ilustración o Icono */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="w-48 h-48 bg-red-100 rounded-full"></div>
          </div>
          <div className="relative flex flex-col items-center">
            <span className="text-9xl font-black text-red-600 tracking-tighter">404</span>
            <AlertCircle className="w-12 h-12 text-red-500 absolute -bottom-2 right-4 bg-white rounded-full p-1 shadow-lg" />
          </div>
        </div>

        {/* Mensaje */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Página no encontrada!</h1>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Lo sentimos, la página que buscas no existe o ha sido movida a otra ubicación. 
          Verifica la URL o regresa al inicio.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver atrás
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </button>
        </div>

        {/* Pie de página decorativo */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            © 2025 Repuestos Picha. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

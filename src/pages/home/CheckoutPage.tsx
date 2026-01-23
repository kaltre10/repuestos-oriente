import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import useStore from '../../states/global';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';

const CheckoutPage = () => {
  const { notify } = useNotify()
  const navigate = useNavigate();
  const { cart, getCartTotal, user } = useStore();  
  // const [isModalOpen, setIsModalOpen] = useState(false); 
  // const [isProcessing, setIsProcessing] = useState(false);  
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      notify.info('Debes iniciar sesión para realizar una compra');
      return;
    }
    if (!accountData.name || !accountData.email || !accountData.phone) {
      notify.error('Por favor complete todos los campos de información del cliente');
      return;
    }
    navigate('/payment', { state: { accountData } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-lg"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center space-x-3 mb-8">
            <CheckCircle className="text-red-600 w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-800">Finalizar Compra</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Client Information */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <UserIcon className="text-red-600 w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Información del Cliente</h2>
                </div>

                <form className="space-y-5">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Ej: Juan Pérez"
                        value={accountData.name}
                        onChange={handleAccountChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="juan@ejemplo.com"
                        value={accountData.email}
                        onChange={handleAccountChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="0412-0000000"
                        value={accountData.phone}
                        onChange={handleAccountChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Instructions (Simplified but visually nice) */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="text-red-600 w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-2">Instrucciones de Pago</h3>
                    <p className="text-sm text-red-800 leading-relaxed">
                      Una vez completado el pedido, nuestro equipo se pondrá en contacto contigo a través de los datos proporcionados para coordinar el pago y la entrega de tus productos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingBag className="mr-2 w-5 h-5 text-red-600" />
                Resumen del Pedido
              </h2>

              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="relative group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                      />
                      {/* <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                        {item.quantity}
                      </span> */}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="">
                          <span className="text-xs text-gray-500">Precio unit: </span>
                          <FormattedPrice price={item.price} className="text-xs text-gray-600" />
                        </div>
                        <div className="text-gray-500">
                          <span className="text-xs ">Cantidad: </span>
                          {item.quantity}
                        </div>
                        <FormattedPrice price={item.price * item.quantity} className="text-red-600 font-bold" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <FormattedPrice price={getCartTotal()} className="font-medium text-gray-800" />
                </div>
                <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-200">
                  <span>Envío</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Gratis</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black pt-2">
                  <span className="text-gray-800">Total</span>
                  <FormattedPrice price={getCartTotal()} className="text-red-600" />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-red-200 mt-8 flex items-center justify-center space-x-2 group"
              >
                <span>Proceder al pago</span>
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

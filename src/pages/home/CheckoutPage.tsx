import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, ShoppingBag, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import useStore from '../../states/global';
import { apiUrl } from '../../utils/utils';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      alert('Debes iniciar sesión para realizar una compra');
      return;
    }
    if (!accountData.name || !accountData.email || !accountData.phone) {
      alert('Por favor complete todos los campos de información del cliente');
      return;
    }
    setIsModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const checkoutData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        buyerId: user.id,
        paymentMethod: 'Pago Móvil' // Por ahora fijo ya que es el único mostrado
      };

      const response = await axios.post(`${apiUrl}/checkout`, checkoutData);

      if (response.data.success) {
        clearCart();
        alert('¡Compra realizada con éxito! Su pedido está siendo procesado.');
        navigate('/');
      } else {
        alert('Hubo un error al procesar su compra: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error during checkout:', error);
      alert('Error de conexión al procesar la compra');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
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
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">Precio unit: ${item.price.toFixed(2)}</p>
                        <p className="text-red-600 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-200">
                  <span>Envío</span>
                  <span className="text-green-600 font-bold uppercase text-xs">Gratis</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black pt-2">
                  <span className="text-gray-800">Total</span>
                  <span className="text-red-600">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-red-200 mt-8 flex items-center justify-center space-x-2 group"
              >
                <span>Completar Pedido</span>
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Confirmar compra?</h3>
              <p className="text-gray-500 mb-8">
                Estás a punto de realizar un pedido por un total de <span className="font-bold text-red-600">${getCartTotal().toFixed(2)}</span>. ¿Deseas continuar?
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={confirmPurchase}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Sí, realizar pedido'
                  )}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isProcessing}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all"
                >
                  No, revisar de nuevo
                </button>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, ShoppingBag, CheckCircle, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import useStore from '../../states/global';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';
import useConfirmStore from '../../states/useConfirmStore';
import { useDollarRate } from '../../hooks/useDollarRate';

const CheckoutPage = () => {
  const { notify } = useNotify()
  const navigate = useNavigate();
  const { cart, getCartTotal, user, removeFromCart, incrementQuantity, decrementQuantity } = useStore();  
  const { freeShippingThreshold, shippingPrice } = useDollarRate();
  // const [isModalOpen, setIsModalOpen] = useState(false); 
  // const [isProcessing, setIsProcessing] = useState(false);  
  
  // Calcular si el envío es gratis
  const cartTotal = getCartTotal();
  const freeShipping = cartTotal >= Number(freeShippingThreshold);
  const shippingCost = freeShipping ? 0 : Number(shippingPrice);
  const finalTotal = cartTotal + shippingCost;
  
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
                  <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="relative group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.category}</p>
                      <div className="mt-2">
                        <div className="">
                          <span className="text-xs text-gray-500">Precio unit: </span>
                          <div className="inline-flex flex-col align-middle">
                            {(item as any).discount && (item as any).discount > 0 ? (
                              <>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-gray-400 line-through leading-none">
                                    <FormattedPrice price={Number(item.price) / (1 - (Number((item as any).discount) / 100))} />
                                  </span>
                                  <span className="text-[9px] font-bold text-red-600">
                                    {(item as any).discount}% OFF
                                  </span>
                                </div>
                                <FormattedPrice price={item.price} className="text-xs text-red-600 font-bold" />
                              </>
                            ) : (
                              <FormattedPrice price={item.price} className="text-xs text-gray-600 font-bold" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      {/* Primera fila: Contador y botón de eliminar */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={async () => {
                            const { ask } = useConfirmStore.getState();
                            const confirmed = await ask('¿Estás seguro de que deseas eliminar este producto del carrito?');
                            if (confirmed) {
                              removeFromCart(item.id);
                            }
                          }}
                          className="cursor-pointer p-1 hover:bg-red-100 text-red-500 rounded transition-colors ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {/* Segunda fila: Precio del producto */}
                      <div className="mt-2">
                        <FormattedPrice price={item.price * item.quantity} className="text-red-600 font-bold" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <FormattedPrice price={cartTotal} className="font-medium text-gray-800" />
                </div>
                <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-200">
                  <span>Envío</span>
                  {freeShipping ? (
                    <span className="text-green-600 font-bold uppercase text-xs">Gratis</span>
                  ) : (
                    <FormattedPrice price={shippingCost} className="text-gray-800 font-medium" />
                  )}
                </div>
                <div className="flex justify-between items-center text-xl font-black pt-2">
                  <span className="text-gray-800">Total</span>
                  <FormattedPrice price={finalTotal} className="text-red-600" />
                </div>
              </div>
            

                {!freeShipping && (
                  <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-700 text-xs font-semibold">🚚 ¡Aprovecha!</span>
                      <span className="text-emerald-600 text-xs">Envío gratis a partir de:</span>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-emerald-100">
                      <FormattedPrice price={Number(freeShippingThreshold)} className="text-emerald-700 font-bold text-xs" />
                    </div>
                  </div>
                )}
              
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

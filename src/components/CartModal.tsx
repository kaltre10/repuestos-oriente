import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../states/global';
import FormattedPrice from './FormattedPrice';

const CartModal = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, toggleCart, removeFromCart, incrementQuantity, decrementQuantity, getCartTotal } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={toggleCart}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[90%] sm:max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-800">Tu Carrito</h2>
            <span className="bg-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full animate-zoom-in">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={toggleCart}
            className="cursor-pointer p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all duration-300 active:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 py-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-4 flex justify-center">
                <div className="p-6 bg-gray-50 rounded-full">
                  <Plus size={48} className="rotate-45 text-gray-300" />
                </div>
              </div>
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <button 
                onClick={toggleCart}
                className="mt-4 text-red-500 font-bold hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
               <div 
                  key={item.id} 
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 group animate-slide-in-right"
                  style={{ 
                    animationDelay: `${index * 50}ms`, 
                    animationFillMode: 'both' 
                  }}
                >
                  <div className="relative flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={item.image || '/placeholder-product.svg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover bg-gray-50 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90 flex-shrink-0"
                          title="Eliminar del carrito"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">{item.category}</p>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <div className="flex flex-col">
                        {item.discount && item.discount > 0 ? (
                          <>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] text-gray-400 line-through">
                                <FormattedPrice price={Number(item.price) / (1 - (Number(item.discount) / 100))} />
                              </span>
                              <span className="text-[10px] font-black text-red-600 bg-red-50 px-1 rounded">
                                -{item.discount}%
                              </span>
                            </div>
                            <FormattedPrice price={item.price} className="text-red-600 font-black text-base" />
                          </>
                        ) : (
                          <FormattedPrice price={item.price} className="text-gray-900 font-black text-base" />
                        )}
                      </div>

                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5 shadow-sm">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="cursor-pointer p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-30 active:scale-90"
                          disabled={item.quantity <= 1}
                          title="Disminuir cantidad"
                        >
                          <Minus size={12} className="text-gray-500" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="cursor-pointer p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all active:scale-90"
                          title="Aumentar cantidad"
                        >
                          <Plus size={12} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <FormattedPrice price={getCartTotal()} className="text-2xl font-black text-red-600" />
            </div>
            <button
              onClick={() => {
                toggleCart();
                navigate('/checkout');
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center space-x-2 group"
            >
              <span>Completar Pedido</span>
              <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

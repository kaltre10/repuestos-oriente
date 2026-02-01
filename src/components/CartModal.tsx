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
      <div className="fixed right-0 top-0 h-full w-full max-w-[90%] sm:max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Carrito de Compras</h2>
          <button
            onClick={toggleCart}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image || '/placeholder-product.svg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-50 shadow-sm border border-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight line-clamp-2">
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
                          className="cursor-pointer p-1 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                          title="Disminuir cantidad"
                        >
                          <Minus size={14} className="text-gray-500" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="cursor-pointer p-1 hover:bg-white hover:shadow-sm rounded transition-all"
                          title="Aumentar cantidad"
                        >
                          <Plus size={14} className="text-gray-500" />
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
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <FormattedPrice price={getCartTotal()} className="text-xl font-bold text-red-500" />
            </div>
            <button
              onClick={() => {
                toggleCart();
                navigate('/checkout');
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded transition-colors"
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

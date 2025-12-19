import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../states/global';

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
      <div className="fixed right-0 top-0 h-full w-full max-w-[80%] lg:max-w-[40%] bg-white shadow-xl flex flex-col">
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
                <div key={item.id} className="flex items-center space-x-4 pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-red-500 font-semibold">${item.price.toFixed(2)}</p>
                  </div>
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
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer p-1 hover:bg-red-100 text-red-500 rounded transition-colors ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
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
              <span className="text-xl font-bold text-red-500">${getCartTotal().toFixed(2)}</span>
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

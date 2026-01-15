import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CopyBtn from '../../components/CopyBtn';
import useStore from '../../states/global';
import Header from '../../components/Header';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useStore();
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    phone: ''
  });


  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value
    });
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically process the payment
    alert('¡Compra realizada con éxito!');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (<>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de la Cuenta</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={accountData.name}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={accountData.email}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={accountData.phone}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos de Pago</h2>

              <div className="space-y-4">

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                      <p className="text-base font-mono text-gray-800">0414-123-4567</p>
                    </div>
                    <CopyBtn text="04141234567" title="Copiar teléfono" />
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Banco:</span>
                      <p className="text-base font-semibold text-gray-800">Banco Mercantil</p>
                    </div>
                    <CopyBtn text="Banco Mercantil" title="Copiar banco" />
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Cédula:</span>
                      <p className="text-base font-mono text-gray-800">V-12345678</p>
                    </div>
                    <CopyBtn text="V12345678" title="Copiar cédula" />
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Monto:</span>
                      <p className="text-base font-bold text-red-600">${getCartTotal().toFixed(2)}</p>
                    </div>
                    <CopyBtn text={getCartTotal().toFixed(2)} title="Copiar monto" />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Instrucciones de Pago Móvil:</strong><br />
                  1. Abre la app de tu banco<br />
                  2. Ve a Pago Móvil<br />
                  3. Selecciona "Pagar servicios" o "Transferir"<br />
                  4. Copia y pega los datos proporcionados arriba<br />
                  5. Completa el pago con el monto exacto<br />
                  6. Una vez realizado el pago, haz clic en "Completar Compra"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-red-500">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded transition-colors mt-6"
            >
              Completar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default CheckoutPage;

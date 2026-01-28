import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, ShoppingBag, CheckCircle, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import useStore from '../../states/global';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';
import useConfirmStore from '../../states/useConfirmStore';
import { useDollarRate } from '../../hooks/useDollarRate';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Componente para actualizar el centro del mapa dinámicamente
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

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
  
  // Inicializar desde localStorage si existe, otherwise usar datos del usuario
  const [accountData, setAccountData] = useState(() => {
    const savedData = localStorage.getItem('checkoutAccountData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    };
  });

  // Estados para envío con persistencia en localStorage
  const [shippingOption, setShippingOption] = useState<string>(() => {
    return localStorage.getItem('checkoutShippingOption') || '';
  });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return localStorage.getItem('checkoutSelectedAddressId') || '';
  });
  const [mapCoordinates, setMapCoordinates] = useState<[number, number]>([10.4806, -66.9036]); // Default: Caracas

  // Obtener direcciones del usuario si está autenticado
  useEffect(() => {
    if (user) {
      let userAddresses: any[] = [];
      
      // Si user.address existe
      if (user.address) {
        try {
          const parsedAddresses = JSON.parse(user.address);
          if (Array.isArray(parsedAddresses)) {
            // Filtrar direcciones válidas
            userAddresses = parsedAddresses.filter((addr: any) => addr && addr.address);
          } else {
            // Si no es un array, crear una dirección con el texto plano
            userAddresses = [{
              id: 'default',
              address: user.address,
              coordinates: [10.4806, -66.9036], // Caracas por defecto
              primary: true
            }];
          }
        } catch (error) {
          // Si no es JSON válido, crear una dirección con el texto plano
          userAddresses = [{
            id: 'default',
            address: user.address,
            coordinates: [10.4806, -66.9036], // Caracas por defecto
            primary: true
          }];
        }
      }
      
      setAddresses(userAddresses);
      
      // Seleccionar la dirección principal si existe
      const primaryAddress = userAddresses.find((addr: any) => addr.primary);
      if (primaryAddress) {
        setSelectedAddressId(primaryAddress.id);
        // Establecer coordenadas del mapa
        if (primaryAddress.coordinates && Array.isArray(primaryAddress.coordinates) && primaryAddress.coordinates.length === 2) {
          setMapCoordinates([primaryAddress.coordinates[0], primaryAddress.coordinates[1]]);
        }
      } else if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].id);
        // Establecer coordenadas del mapa
        if (userAddresses[0].coordinates && Array.isArray(userAddresses[0].coordinates) && userAddresses[0].coordinates.length === 2) {
          setMapCoordinates([userAddresses[0].coordinates[0], userAddresses[0].coordinates[1]]);
        }
      }
    }
  }, [user]);

  // Actualizar coordenadas del mapa cuando se selecciona una dirección diferente
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress && selectedAddress.coordinates && Array.isArray(selectedAddress.coordinates) && selectedAddress.coordinates.length === 2) {
        setMapCoordinates([selectedAddress.coordinates[0], selectedAddress.coordinates[1]]);
      }
    }
  }, [selectedAddressId, addresses]);

  // Guardar opciones de envío en localStorage cuando cambien
  useEffect(() => {
    if (shippingOption) {
      localStorage.setItem('checkoutShippingOption', shippingOption);
    }
  }, [shippingOption]);

  // Guardar dirección seleccionada en localStorage cuando cambie
  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem('checkoutSelectedAddressId', selectedAddressId);
    }
  }, [selectedAddressId]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value
    });
  };

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('checkoutAccountData', JSON.stringify(accountData));
  }, [accountData]);

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
    if (!shippingOption) {
      notify.error('Por favor seleccione una forma de envío');
      return;
    }
    if (shippingOption && addresses.length > 0 && !selectedAddressId) {
      notify.error('Por favor seleccione una dirección de envío');
      return;
    }
    
    // Obtener la dirección seleccionada
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    
    navigate('/payment', { 
      state: { 
        accountData, 
        shippingOption, 
        selectedAddress 
      } 
    });
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

                  {/* Opciones de envío */}
                  <div className="mt-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Forma de Envío
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Empresa de envíos */}
                      <div 
                        className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${shippingOption === 'shipping_company' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-red-300'}`}
                        onClick={() => setShippingOption('shipping_company')}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-full ${shippingOption === 'shipping_company' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <svg className={`w-6 h-6 ${shippingOption === 'shipping_company' ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold text-gray-800 mb-1 ${shippingOption === 'shipping_company' ? 'text-red-600' : ''}`}>Empresa de Envíos</h3>
                            <p className="text-sm text-gray-500">Recoge tu pedido en una sucursal o envía a tu dirección</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${shippingOption === 'shipping_company' ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'}`}>
                              {shippingOption === 'shipping_company' && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* A domicilio */}
                      <div 
                        className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${shippingOption === 'home_delivery' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-red-300'}`}
                        onClick={() => setShippingOption('home_delivery')}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-full ${shippingOption === 'home_delivery' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <svg className={`w-6 h-6 ${shippingOption === 'home_delivery' ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold text-gray-800 mb-1 ${shippingOption === 'home_delivery' ? 'text-red-600' : ''}`}>A Domicilio</h3>
                            <p className="text-sm text-gray-500">Recibe tu pedido directamente en tu dirección</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${shippingOption === 'home_delivery' ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'}`}>
                              {shippingOption === 'home_delivery' && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selección de dirección */}
                  {shippingOption && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          Dirección de Envío
                        </label>
                        <button
                          type="button"
                          onClick={() => navigate('../clients/profile')}
                          className="text-sm text-red-600 font-medium hover:text-red-800 transition-colors flex items-center space-x-1"
                        >
                          <span>{addresses.length > 0 ? 'Agregar otra dirección' : 'Agregar dirección'}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {addresses.length > 0 ? (
                        <>
                          <div className="space-y-3">
                            {addresses.map((address) => (
                              <div 
                                key={address.id}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${selectedAddressId === address.id ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-red-300'}`}
                                onClick={() => setSelectedAddressId(address.id)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-full ${selectedAddressId === address.id ? 'bg-red-100' : 'bg-gray-100'}`}>
                                    <svg className={`w-5 h-5 ${selectedAddressId === address.id ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-gray-800">{address.address}</p>
                                      {address.primary && (
                                        <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                          Principal
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === address.id ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'}`}>
                                      {selectedAddressId === address.id && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Mapa de la dirección seleccionada */}
                          <div className="mt-6 rounded-xl overflow-hidden shadow-md border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 p-4 bg-gray-50 border-b border-gray-200">Ubicación en el Mapa</h4>
                            <div className="h-64">
                              <MapContainer 
                                center={mapCoordinates} 
                                zoom={15} 
                                className="w-full h-full"
                              >
                                <MapUpdater center={mapCoordinates} />
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={mapCoordinates}>
                                  <Popup>
                                    {addresses.find(addr => addr.id === selectedAddressId)?.address}
                                  </Popup>
                                </Marker>
                              </MapContainer>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <h3 className="font-medium text-gray-800 mb-2">No tienes direcciones guardadas</h3>
                          <p className="text-sm text-gray-500 mb-4">Agrega una dirección en tu perfil para continuar</p>
                          <button
                            type="button"
                            onClick={() => navigate('../clients/profile')}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-md hover:shadow-lg"
                          >
                            Ir a Perfil
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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

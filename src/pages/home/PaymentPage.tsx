import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Smartphone, Hash, Image as ImageIcon, CheckCircle, AlertCircle, ChevronLeft, Mail, Phone } from 'lucide-react';
import useStore from '../../states/global';
import { apiUrl, bancos } from '../../utils/utils';
import request from '../../utils/request';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';
import { useDollarRate } from '../../hooks/useDollarRate';
// import { useLocation } from 'react-router-dom';

interface PaymentMethodDB {
  id: number;
  name: string;
  type: string;
  paymentType?: {
    name: string;
  };
  properties: Record<string, string>;
  isActive: boolean;
}

const PaymentPage = () => {
  const { notify } = useNotify()
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart, user, getCartTotal } = useStore();
  const { freeShippingThreshold, shippingPrice } = useDollarRate();
  const accountData = location.state?.accountData;
  const shippingOption = location.state?.shippingOption;
  const selectedAddress = location.state?.selectedAddress;
  
  // Calcular si el envío es gratis
  const cartTotal = getCartTotal();
  const freeShipping = cartTotal >= Number(freeShippingThreshold);
  const shippingCost = freeShipping ? 0 : Number(shippingPrice);
  const finalTotal = cartTotal + shippingCost;

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDB[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodDB | null>(null);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const response = await request.get(`${apiUrl}/payment-methods?onlyActive=true`);
      if (response.data.success) {
        const validatedMethods = response.data.body.paymentMethods.map((method: any) => {
          let properties = method.properties || {};
          if (typeof properties === 'string') {
            try {
              properties = JSON.parse(properties);
            } catch (e) {
              properties = {};
            }
          }
          if (typeof properties !== 'object' || properties === null || Array.isArray(properties)) {
            properties = {};
          }
          return {
            ...method,
            properties
          };
        });
        setPaymentMethods(validatedMethods);
        if (validatedMethods.length > 0) {
          setSelectedMethod(validatedMethods[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      notify.error('Error al cargar los métodos de pago');
    } finally {
      setLoadingMethods(false);
    }
  };

  const getBankName = (code?: string) => {
    if (!code) return '';
    const banco = bancos.find(b => b.codigo === code);
    return banco ? banco.nombre : code;
  };

  const getPropertyIcon = (key: string) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('banco')) return <CreditCard className="w-4 h-4" />;
    if (keyLower.includes('teléfono') || keyLower.includes('phone') || keyLower.includes('celular') || keyLower.includes('movil')) return <Phone className="w-4 h-4" />;
    if (keyLower.includes('email') || keyLower.includes('correo')) return <Mail className="w-4 h-4" />;
    if (keyLower.includes('cuenta') || keyLower.includes('numero') || keyLower.includes('num')) return <Hash className="w-4 h-4" />;
    if (keyLower.includes('ci') || keyLower.includes('rif') || keyLower.includes('identificacion')) return <Hash className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  const formatPropertyName = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirmPurchase = async () => {
    if (!referenceNumber) {
      notify.error('Por favor ingrese el número de referencia');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('buyerId', user?.id.toString() || '');
      formData.append('clientName', accountData?.name || user?.name || '');
      formData.append('clientEmail', accountData?.email || user?.email || '');
      formData.append('clientPhone', accountData?.phone || user?.phone || '');
      formData.append('paymentMethod', selectedMethod?.name || 'Desconocido');
      formData.append('referenceNumber', referenceNumber);
      formData.append('shippingCost', shippingCost.toString());
      formData.append('freeShipping', freeShipping.toString());
      // Convertir shippingOption a nombre legible: 'Empresa de Envíos' o 'A Domicilio'
      const shippingMethodName = shippingOption === 'shipping_company' ? 'Empresa de Envíos' : shippingOption === 'home_delivery' ? 'A Domicilio' : 'standard';
      formData.append('shippingMethod', shippingMethodName);
      formData.append('shippingAddress', selectedAddress?.address || '');
      if (receiptImage) {
        formData.append('receiptImage', receiptImage);
      }

      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      formData.append('items', JSON.stringify(items));

      const response = await request.postImage(`${apiUrl}/sales/checkout`, formData);

      if (response.data.success) {
        clearCart();
        // Limpiar datos de localStorage al completar la compra exitosamente
        localStorage.removeItem('checkoutAccountData');
        localStorage.removeItem('checkoutShippingOption');
        localStorage.removeItem('checkoutSelectedAddressId');
        notify.success('¡Compra realizada con éxito! Su pedido está siendo procesado.');
        navigate('/clients/purchases');
      } else {
        notify.error('Hubo un error al procesar su compra: ' + (response.data.message || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error during checkout:', error);
      const errorMessage = error.response?.data?.message || 'Error de conexión al procesar la compra';
      notify.error('Hubo un error al procesar su compra: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-all hover:-translate-x-1 animate-slide-up"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver al checkout
        </button>

        <div className="flex items-center space-x-3 mb-8 animate-in slide-in-from-left-8 duration-500">
          <CreditCard className="text-red-600 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800">Método de Pago</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Payment Selection & Info */}
          <div className="space-y-6 animate-in slide-in-from-left-10 duration-700">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Seleccione su método</h2>
              
              {loadingMethods ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 ${
                        selectedMethod?.id === method.id
                          ? 'border-red-500 bg-red-50 scale-[1.02]'
                          : 'border-gray-200 bg-white hover:border-red-300'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full transition-colors duration-300 ${
                          selectedMethod?.id === method.id ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {method.type === 'Pago Movil' ? (
                            <Smartphone className={`w-6 h-6 transition-colors duration-300 ${
                              selectedMethod?.id === method.id ? 'text-red-600' : 'text-gray-500'
                            }`} />
                          ) : (
                            <CreditCard className={`w-6 h-6 transition-colors duration-300 ${
                              selectedMethod?.id === method.id ? 'text-red-600' : 'text-gray-500'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-gray-800 mb-1 transition-colors duration-300 ${
                            selectedMethod?.id === method.id ? 'text-red-600' : ''
                          }`}>{method.name}</h3>
                          <p className="text-sm text-gray-500">{method.type}</p>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedMethod?.id === method.id ? 'border-red-500 bg-red-500 scale-110' : 'border-gray-300 bg-white'
                          }`}>
                            {selectedMethod?.id === method.id && (
                              <svg className="w-4 h-4 text-white animate-in zoom-in duration-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No hay métodos de pago disponibles</p>
              )}
            </div>

            {selectedMethod && (
              <div className="bg-red-600 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 animate-pulse" />
                  Información para el pago
                </h2>

                <div className="space-y-4 relative z-10">
                  {/* Método de pago en efectivo */}
                  {(() => {
                    const paymentType = selectedMethod.type || '';
                    const lowerType = paymentType.toLowerCase();
                    return lowerType.includes('efectivo');
                  })() ? (
                    <div className="bg-white/10 p-4 rounded-lg">
                      <p className="font-medium">Pague en efectivo al recibir su pedido.</p>
                      <p className="text-sm text-red-100 mt-2">Nuestro repartidor se pondrá en contacto con usted para coordinar la entrega.</p>
                    </div>
                  ) : (
                    // Para otros métodos de pago con propiedades dinámicas
                    <div className="space-y-3">
                      {Object.entries(selectedMethod.properties).map(([key, value]) => {
                        // Formatear el valor si es un banco
                        const displayValue = key.toLowerCase().includes('banco') ? getBankName(value) : value;
                        
                        return (
                          <div key={key} className="bg-white/10 p-3 rounded-lg transition-all hover:bg-white/15">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white">
                                {getPropertyIcon(key)}
                              </div>
                              <div className="flex-1">
                                <p className="text-red-100 text-xs uppercase font-semibold">{formatPropertyName(key)}</p>
                                <p className="font-bold text-lg break-all">{displayValue}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reference & Capture */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <Hash className="mr-2 w-5 h-5 text-red-600" />
                Información del Pago
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de Referencia (últimos 4-6 dígitos)
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Ej: 123456"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Comprobante de Pago (Imagen - Opcional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-red-400 transition-colors cursor-pointer group relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto rounded-lg mb-2" />
                      ) : (
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-red-500 transition-colors" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <span className="relative rounded-md font-medium text-red-600 hover:text-red-500">
                          {previewUrl ? 'Cambiar imagen' : 'Cargar captura'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <FormattedPrice price={cartTotal} />
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <FormattedPrice price={shippingCost} />
                </div>
                <div className="border-t pt-3 flex justify-between items-center font-bold">
                  <span className="text-gray-800">Total a pagar:</span>
                  <FormattedPrice price={finalTotal} className="text-2xl text-red-600" />
                </div>
              </div>

              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-red-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Finalizar Compra</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Su pedido será validado por nuestro equipo una vez verificado el pago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Hash, Image as ImageIcon, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import useStore from '../../states/global';
import { apiUrl, bancos } from '../../utils/utils';
import request from '../../utils/request';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';

interface PaymentMethodDB {
  id: number;
  name: string;
  type: 'Pago Movil' | 'Zelle' | 'Transferencia' | 'Efectivo';
  bank?: string;
  email?: string;
  accountNumber?: string;
  phone?: string;
  ci_rif?: string;
  isActive: boolean;
}

const PaymentPage = () => {
  const { notify } = useNotify()
  // const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart, user, getCartTotal } = useStore();
  // const accountData = location.state?.accountData;

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
      const response = await request.get(`${apiUrl}/payment-methods?onlyActive=true`);
      // Acceder a response.data.body.paymentMethods según el formato del responser.js
      const methods = response.data.body?.paymentMethods || [];
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedMethod(methods[0]);
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
      formData.append('paymentMethod', selectedMethod?.name || 'Desconocido');
      formData.append('referenceNumber', referenceNumber);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver al checkout
        </button>

        <div className="flex items-center space-x-3 mb-8">
          <CreditCard className="text-red-600 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800">Método de Pago</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Payment Selection & Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Seleccione su método</h2>
              
              {loadingMethods ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                        selectedMethod?.id === method.id
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                    >
                      {method.type === 'Pago Movil' ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <CreditCard className="w-5 h-5" />
                      )}
                      <span className="font-semibold text-xs text-center">{method.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No hay métodos de pago disponibles</p>
              )}
            </div>

            {selectedMethod && (
              <div className="bg-red-600 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  {selectedMethod.type === 'Pago Movil' ? <Smartphone className="mr-2" /> : <CreditCard className="mr-2" />}
                  Datos para el pago
                </h2>

                <div className="space-y-4 relative z-10">
                  {selectedMethod.bank && (
                    <div>
                      <p className="text-red-100 text-sm">Banco</p>
                      <p className="font-bold text-lg">{getBankName(selectedMethod.bank)}</p>
                    </div>
                  )}
                  {selectedMethod.phone && (
                    <div>
                      <p className="text-red-100 text-sm">Teléfono</p>
                      <p className="font-bold text-lg">{selectedMethod.phone}</p>
                    </div>
                  )}
                  {selectedMethod.ci_rif && (
                    <div>
                      <p className="text-red-100 text-sm">Cédula / RIF</p>
                      <p className="font-bold text-lg">{selectedMethod.ci_rif}</p>
                    </div>
                  )}
                  {selectedMethod.email && (
                    <div>
                      <p className="text-red-100 text-sm">Email</p>
                      <p className="font-bold text-lg">{selectedMethod.email}</p>
                    </div>
                  )}
                  {selectedMethod.accountNumber && (
                    <div>
                      <p className="text-red-100 text-sm">Número de Cuenta</p>
                      <p className="font-bold text-base break-all">{selectedMethod.accountNumber}</p>
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
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Total a pagar:</span>
                <FormattedPrice price={getCartTotal()} className="text-2xl font-bold text-red-600" />
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

import { useState, useEffect, useMemo, useRef } from 'react';
import { ShoppingBag, Package, Calendar, Clock, ChevronRight, AlertCircle, ExternalLink, X, CreditCard, Hash, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';
import useStore from '../../states/global';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';

interface Sale {
  id: number;
  dailyRate: number;
  quantity: number;
  status: string;
  buyerId: number;
  paymentMethod: string;
  saleDate: string;
  productId: number;
  rating: number | null;
  referenceNumber: string | null;
  receiptImage: string | null;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    partNumber: string;
    images?: { image: string }[];
  };
}

const Purchases = () => {
  const { user, currency, setCurrency } = useStore();
  const { notify } = useNotify();
  const [purchases, setPurchases] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group purchases by date and payment reference/method to simulate "orders"
  const groupedPurchases = useMemo(() => {
    const groups: { [key: string]: Sale[] } = {};

    purchases.forEach(purchase => {
      // Create a key based on date (minute precision) and reference/method
      const date = new Date(purchase.saleDate);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      const groupKey = `${dateKey}_${purchase.paymentMethod}_${purchase.referenceNumber || 'no-ref'}`;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(purchase);
    });

    return Object.values(groups).sort((a, b) =>
      new Date(b[0].saleDate).getTime() - new Date(a[0].saleDate).getTime()
    );
  }, [purchases]);

  const fetchPurchases = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await request.get(`${apiUrl}/sales/user/${user.id}`);
      if (response.data) {
        setPurchases(response.data.body.sales);
      } else {
        setError('No se pudieron cargar las compras');
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Error de conexión al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const openModal = (purchase: Sale) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadReceipt = async () => {
    if (!selectedFile || !selectedPurchase) return;

    // Get all sales in the same group as selectedPurchase
    const currentGroup = groupedPurchases.find(g =>
      g[0].paymentMethod === selectedPurchase.paymentMethod &&
      g[0].referenceNumber === selectedPurchase.referenceNumber &&
      new Date(g[0].saleDate).getTime() === new Date(selectedPurchase.saleDate).getTime()
    );

    if (!currentGroup) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('receiptImage', selectedFile);
    formData.append('saleIds', JSON.stringify(currentGroup.map(s => s.id)));

    try {
      const response = await request.postImage(`${apiUrl}/sales/upload-receipt`, formData);

      if (response.data) {
        notify.success('Comprobante subido con éxito');
        await fetchPurchases(); // Refresh list

        // Update selectedPurchase to show the new image
        const updatedReceiptImage = response.data.body.receiptImage;
        setSelectedPurchase({ ...selectedPurchase, receiptImage: updatedReceiptImage });

        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Error uploading receipt:', err);
      notify.error('Error al subir el comprobante');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      case 'shipped': return 'Enviado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-100"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Aún no tienes compras</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">Cuando realices tu primer pedido, aparecerá aquí para que puedas hacerle seguimiento.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-100"
        >
          Explorar productos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Mis Compras</h1>
          <p className="text-gray-500 font-medium">Tienes un total de {purchases.length} productos comprados</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${currency === 'USD'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('BS')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${currency === 'BS'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              BS
            </button>
          </div>
          <div className="bg-red-50 p-3 rounded-2xl">
            <Package className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {groupedPurchases.map((group, index) => {
          const mainPurchase = group[0];
          const totalAmount = group.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

          return (
            <div
              key={index}
              onClick={() => openModal(mainPurchase)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Product Image Stack */}
                  <div className="w-full md:w-32 h-32 flex-shrink-0 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {group.slice(0, 3).map((item, i) => (
                        <img
                          key={item.id}
                          src={item.product.images && item.product.images.length > 0
                            ? `${imagesUrl}${item.product.images[0].image}`
                            : 'https://via.placeholder.com/150'}
                          alt={item.product.name}
                          className="absolute w-24 h-24 object-cover rounded-xl shadow-md border-2 border-white transition-all duration-300"
                          style={{
                            zIndex: 3 - i,
                            transform: `translateX(${i * 12}px) translateY(${i * -4}px) rotate(${i * 2}deg)`,
                            opacity: 1 - (i * 0.2)
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {group.length > 1
                            ? `Pedido de ${group.length} productos`
                            : mainPurchase.product.name}
                        </h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          {group.length > 1
                            ? `${group.reduce((sum, item) => sum + item.quantity, 0)} artículos en total`
                            : `Ref: ${mainPurchase.product.partNumber || 'N/A'}`}
                        </p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${getStatusColor(mainPurchase.status)}`}>
                        {translateStatus(mainPurchase.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-semibold">{new Date(mainPurchase.saleDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-semibold">{new Date(mainPurchase.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <CreditCard className="w-4 h-4 mr-2 text-red-500" />
                        <span className="font-semibold">{mainPurchase.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-400 text-sm font-medium">Total pagado:</span>
                        <FormattedPrice
                          price={totalAmount}
                          className="text-2xl font-black text-red-600"
                        />
                      </div>
                      <div className="flex items-center text-gray-400 group-hover:text-red-600 font-bold text-sm transition-colors">
                        Ver detalles
                        <ChevronRight className="w-4 h-4 ml-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Detalles del Pedido</h2>
                <p className="text-gray-500 text-sm font-medium">
                  {new Date(selectedPurchase.saleDate).toLocaleDateString()} a las {new Date(selectedPurchase.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-8">
              {/* Products List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  Productos
                </h3>
                <div className="space-y-3">
                  {groupedPurchases.find(g =>
                    g[0].paymentMethod === selectedPurchase.paymentMethod &&
                    g[0].referenceNumber === selectedPurchase.referenceNumber &&
                    new Date(g[0].saleDate).getTime() === new Date(selectedPurchase.saleDate).getTime()
                  )?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 bg-white">
                      <img
                        src={item.product.images && item.product.images.length > 0
                          ? `${imagesUrl}${item.product.images[0].image}`
                          : 'https://via.placeholder.com/150'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ref: {item.product.partNumber || 'N/A'}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-gray-500">Cant: {item.quantity}</span>
                          <FormattedPrice price={item.product.price * item.quantity} className="font-black text-red-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    Información de Pago
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Método:</span>
                      <span className="font-bold text-gray-900 uppercase">{selectedPurchase.paymentMethod}</span>
                    </div>
                    {selectedPurchase.referenceNumber && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Referencia:</span>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <Hash className="w-3.5 h-3.5 text-red-500" />
                          {selectedPurchase.referenceNumber}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Estado:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(selectedPurchase.status)}`}>
                        {translateStatus(selectedPurchase.status)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-gray-900 font-bold">Total:</span>
                      <FormattedPrice
                        price={groupedPurchases.find(g =>
                          g[0].paymentMethod === selectedPurchase.paymentMethod &&
                          g[0].referenceNumber === selectedPurchase.referenceNumber &&
                          new Date(g[0].saleDate).getTime() === new Date(selectedPurchase.saleDate).getTime()
                        )?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0}
                        className="text-xl font-black text-red-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-red-500" />
                    Comprobante
                  </h3>
                  {selectedPurchase.receiptImage ? (
                    <div className="group relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square md:aspect-auto md:h-[132px]">
                      <img
                        src={`${imagesUrl}${selectedPurchase.receiptImage}`}
                        alt="Comprobante de pago"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={`${imagesUrl}${selectedPurchase.receiptImage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Ver imagen
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!previewUrl ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border-2 border-dashed border-red-200 text-red-600 h-[132px] cursor-pointer hover:bg-red-100 transition-colors group"
                        >
                          <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold">Subir comprobante</p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 h-[132px]">
                          <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm">
                            <button
                              onClick={handleUploadReceipt}
                              disabled={uploading}
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {uploading ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Confirmar subida
                            </button>
                          </div>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 font-medium text-center italic">
                        El comprobante será revisado por nuestro equipo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;

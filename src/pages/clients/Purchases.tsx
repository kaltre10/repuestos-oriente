import { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingBag, Package, Calendar, Clock, ChevronRight, AlertCircle, ExternalLink, X, CreditCard, Hash, Image as ImageIcon, Upload, CheckCircle2, UserIcon, Filter, Trash2, Loader2 } from 'lucide-react';
import useStore from '../../states/global';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';
import Rating from '../../components/Rating';
import { optimizeImage } from '../../utils/imageOptimizer';

// Sale interface updated for the new Order table structure
// The status field is now in the Order table, not in the Sale table
// Making status optional for backward compatibility during transition
interface Order {
  id: number;
  orderNumber: string;
  buyerId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: string;
  shippingCost: number;
  total: number;
  paymentMethodId: number;
  shippingMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: {
    id: number;
    name: string;
  };
  sales: {
    id: number;
    quantity: number;
    unitPrice: number;
    originalPrice: number;
    discount: number;
    product: {
      id: number;
      name: string;
      price: number;
      partNumber: string;
      images?: { image: string }[];
    };
    rating: number | null;
    referenceNumber: string | null;
    receiptImage: string | null;
  }[];
}

const Purchases = () => {
  const { user, currency, setCurrency } = useStore();
  const { notify } = useNotify();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Pagination and Filter states
  // Obtener la fecha de hoy en la zona horaria de Venezuela (UTC-4)
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Caracas'
  }).format(new Date());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: today,
    end: today
  });
  const [showFilters, setShowFilters] = useState(false);
  const [, setIsFiltered] = useState(false);

  const lastOrderElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore]);

  const fetchPurchases = async (isNewSearch = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      const params = new URLSearchParams();
      params.append('page', isNewSearch ? '1' : page.toString());
      params.append('limit', '20');
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await request.get(`${apiUrl}/orders/buyer/${user.id}?${params.toString()}`);
      if (response.data) {
        const newOrders = response.data.body.orders;
        if (isNewSearch) {
          setOrders(newOrders);
        } else {
          setOrders(prev => [...prev, ...newOrders]);
        }
        setHasMore(newOrders.length === 20);
      } else {
        setError('No se pudieron cargar las compras');
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Error de conexión al cargar las compras');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const sendRating = async ({ item, i }: { item: any, i: number }) => {
    try {
      await request.put(`${apiUrl}/sales/${item.id}`, {
        rating: i,
      });
      notify.success('Reseña enviada con éxito');
      
      // Update local state to reflect the change immediately
      if (selectedOrder) {
        const updatedSales = selectedOrder.sales.map(s => 
          s.id === item.id ? { ...s, rating: i } : s
        );
        setSelectedOrder({ ...selectedOrder, sales: updatedSales });
      }

      // Also update the main orders list to keep everything in sync
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === selectedOrder?.id) {
          const updatedSales = order.sales.map(s => 
            s.id === item.id ? { ...s, rating: i } : s
          );
          return { ...order, sales: updatedSales };
        }
        return order;
      }));

    } catch (err) {
      console.error('Error sending rating:', err);
      notify.error('Error al enviar la reseña');
    }
  };

  useEffect(() => {
    if (page === 1) {
      fetchPurchases(true);
    } else {
      fetchPurchases(false);
    }
  }, [user, page]);

  const handleDateFilter = () => {
    setIsFiltered(true);
    if (page === 1) {
      fetchPurchases(true);
    } else {
      setPage(1);
    }
  };

  const clearFilters = () => {
    setDateRange({ start: today, end: today });
    setIsFiltered(false);
    if (page === 1) {
      fetchPurchases(true);
    } else {
      setPage(1);
    }
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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
    if (!selectedFile || !selectedOrder) return;

    setUploading(true);
    try {
      // Optimizar el comprobante antes de subirlo
      const optimizedFile = await optimizeImage(selectedFile);
      
      const formData = new FormData();
      formData.append('receiptImage', optimizedFile);
      formData.append('saleIds', JSON.stringify(selectedOrder.sales.map(s => s.id)));

      const response = await request.postImage(`${apiUrl}/sales/upload-receipt`, formData);

      if (response.data) {
        notify.success('Comprobante subido con éxito');
        await fetchPurchases(true); // Refresh list

        // Update selectedOrder to show the new image in modal
        const updatedReceiptImage = response.data.body.receiptImage;
        const updatedSales = selectedOrder.sales.map(s => ({ ...s, receiptImage: updatedReceiptImage }));
        setSelectedOrder({ ...selectedOrder, sales: updatedSales });

        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Error uploading receipt:', err);
      notify.error('Error al subir el comprobante');
    } finally {
      setUploading(true);
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
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
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

  const hasActiveFilter = dateRange.start !== '' || dateRange.end !== '';

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Mis Compras</h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">Tienes un total de {orders.length} pedidos realizados</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl transition-all ${showFilters ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Filter className="w-5 h-5 md:w-6 md:h-6" />
          </button>
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
            <Package className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters Form */}
      {showFilters && (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Desde</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Hasta</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDateFilter}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center"
                title="Limpiar filtros"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center p-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            {hasActiveFilter ? (
              <Calendar className="w-10 h-10 text-gray-300" />
            ) : (
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {hasActiveFilter ? 'No hay compras en este rango de fechas' : 'Aún no tienes compras'}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {hasActiveFilter
              ? 'Prueba ajustando el rango de fechas para encontrar lo que buscas.'
              : 'Cuando realices tu primer pedido, aparecerá aquí para que puedas hacerle seguimiento.'}
          </p>
          <button
            onClick={() => {
              if (hasActiveFilter) {
                clearFilters();
              } else {
                window.location.href = '/';
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-red-100"
          >
            {hasActiveFilter ? 'Limpiar filtros' : 'Explorar productos'}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {orders.map((order, index) => {
            const isLastElement = index === orders.length - 1;

            return (
              <div
                key={order.id}
                ref={isLastElement ? lastOrderElementRef : null}
                onClick={() => openModal(order)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    {/* Product Image Stack */}
                    <div className="w-full md:w-32 h-24 md:h-32 flex-shrink-0 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {order.sales.slice(0, 3).map((item, i) => (
                          <img
                            key={item.id}
                            src={item.product.images && item.product.images.length > 0
                              ? `${imagesUrl}${item.product.images[0].image}`
                              : '/placeholder-product.svg'}
                            alt={item.product.name}
                            className="absolute w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md border-2 border-white transition-all duration-300"
                            style={{
                              zIndex: 3 - i,
                              transform: `translateX(${i * 12}px) translateY(${i * -4}px) rotate(${i * 2}deg)`,
                              opacity: 1 - (i * 0.2)
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                            {order.sales.length > 1
                              ? `Pedido de ${order.sales.length} productos`
                              : order.sales[0].product.name}
                          </h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
                            {order.sales.length > 1
                              ? `${order.sales.reduce((sum, item) => sum + item.quantity, 0)} artículos en total`
                              : `Ref: ${order.sales[0].product.partNumber || 'N/A'}`}
                          </p>
                        </div>
                        <div className={`self-start sm:self-center px-3 py-1 rounded-full md:text-xs font-black border uppercase tracking-wider ${getStatusColor(order.status || 'Desconocido')}`}>
                          {translateStatus(order.status || 'Desconocido')}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                        <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                          <span className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                          <Clock className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                          <span className="font-semibold">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                          <CreditCard className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                          <span className="font-semibold uppercase">{order.paymentMethod?.name || 'N/A'}</span>
                        </div>
                        {order.orderNumber && (
                          <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                            <Hash className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                            <span className="font-semibold">{order.orderNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-gray-400 text-xs md:text-sm font-medium">Total:</span>
                          <FormattedPrice
                            price={order.total}
                            className="text-xl md:text-2xl font-black text-red-600"
                          />
                        </div>
                        <div className="flex items-center text-gray-400 group-hover:text-red-600 font-bold text-xs md:text-sm transition-colors">
                          <span className="hidden sm:inline">Ver detalles</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading More Indicator */}
      {isFetchingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-red-600" />
            <span>Cargando más compras...</span>
          </div>
        </div>
      )}

      {!hasMore && orders.length > 0 && (
        <p className="text-center text-gray-400 text-sm font-medium py-4">
          Has llegado al final de tus compras
        </p>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 truncate">Detalles del Pedido</h2>
                <p className="text-gray-500 text-xs md:text-sm font-medium">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()} a las {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 flex-shrink-0"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6 md:space-y-8">

              {/* Products List */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                  Productos
                </h3>
                <div className="space-y-3">
                  {selectedOrder.sales.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-gray-100 bg-white">
                      <img
                        src={item.product.images && item.product.images.length > 0
                          ? `${imagesUrl}${item.product.images[0].image}`
                          : '/placeholder-product.svg'}
                        alt={item.product.name}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg md:rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className='flex justify-between'>
                          <h4 className="font-bold text-gray-900 text-xs md:text-sm truncate">{item.product.name}</h4>
                          <Rating hover={true} action={(i: number) => {
                            sendRating({ item, i })
                          }} stars={item.rating || null} />
                        </div>

                        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider truncate">Ref: {item.product.partNumber || 'N/A'}</p>
                        <div className="flex items-center justify-between mt-0.5 md:mt-1">
                          <span className="text-[10px] md:text-xs font-bold text-gray-500">Cant: {item.quantity}</span>
                          <div className="text-right">
                            {item.discount > 0 && (
                              <div className="flex items-center justify-end gap-1.5">
                                <FormattedPrice
                                  price={item.originalPrice}
                                  className="line-through text-gray-400 text-[10px] md:text-xs"
                                />
                                <span className="bg-red-100 text-red-600 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">-{item.discount}%</span>
                              </div>
                            )}
                            <FormattedPrice
                              price={item.unitPrice * item.quantity}
                              className="font-black text-sm md:text-base text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 space-y-3">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    Resumen del Pedido
                  </h3>
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Subtotal:</span>
                      <FormattedPrice price={selectedOrder.total - (selectedOrder.shippingCost || 0)} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Envío:</span>
                      <FormattedPrice price={selectedOrder.shippingCost || 0} />
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-sm md:text-base">Total:</span>
                      <FormattedPrice
                        price={selectedOrder.total}
                        className="text-lg md:text-xl font-black text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Info, Payment Info, Shipping & Receipt Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    Información del Cliente
                  </h3>
                  <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Nombre:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.clientName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Correo:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.clientEmail || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Teléfono:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.clientPhone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Usuario Original:</span>
                      <span className="font-bold text-gray-900">{user?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    Información de Pago
                  </h3>
                  <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Método:</span>
                      <span className="font-bold text-gray-900 uppercase">{selectedOrder.paymentMethod?.name || 'N/A'}</span>
                    </div>
                    {selectedOrder.sales[0]?.referenceNumber && (
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-gray-500 font-medium">Referencia:</span>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <Hash className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500" />
                          {selectedOrder.sales[0].referenceNumber}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Estado:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusColor(selectedOrder.status || 'Desconocido')}`}>
                        {translateStatus(selectedOrder.status || 'Desconocido')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    Información de Envío
                  </h3>
                  <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Dirección:</span>
                      <span className="font-bold text-gray-900 max-w-[60%] text-right">{selectedOrder.shippingAddress || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Forma de Envío:</span>
                      <span className="font-bold text-gray-900 uppercase">{selectedOrder.shippingMethod || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Número de Pedido:</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <Hash className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500" />
                        {selectedOrder.orderNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 font-medium">Costo:</span>
                      <FormattedPrice price={selectedOrder.shippingCost || 0} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    Comprobante
                  </h3>
                  {selectedOrder.sales[0]?.receiptImage ? (
                    <div className="group relative rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-video md:h-[132px]">
                      <img
                        src={`${imagesUrl}${selectedOrder.sales[0].receiptImage}`}
                        alt="Comprobante de pago"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={`${imagesUrl}${selectedOrder.sales[0].receiptImage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-gray-900 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                        >
                          <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          Ver imagen
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!previewUrl ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-4 md:p-6 bg-red-50 rounded-xl md:rounded-2xl border-2 border-dashed border-red-200 text-red-600 h-[100px] md:h-[132px] cursor-pointer hover:bg-red-100 transition-colors group"
                        >
                          <Upload className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-[10px] md:text-xs font-bold text-center">Subir comprobante</p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 h-[100px] md:h-[132px]">
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
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm">
                            <button
                              onClick={handleUploadReceipt}
                              disabled={uploading}
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-bold py-1 md:py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                      <p className="text-[9px] md:text-[10px] text-gray-400 font-medium text-center italic">
                        El comprobante será revisado por nuestro equipo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-lg text-sm md:text-base"
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

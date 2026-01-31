import { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, ShoppingBag, User, Calendar, Filter, Trash2, ChevronRight, X, CreditCard, Hash, Image as ImageIcon, Mail, Package } from 'lucide-react';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';
import Rating from '../../components/Rating';

// Sale interface updated for the new Order table structure
// The status field is now in the Order table, not in the Sale table
// Making status optional for backward compatibility during transition
interface Sale {
  id: number;
  dailyRate: number;
  quantity: number;
  status?: string; // Optional for backward compatibility - will be removed once Order table is fully implemented
  buyerId: number;
  paymentMethod: string;
  referenceNumber: string | null;
  receiptImage: string | null;
  saleDate: string;
  productId: number;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  discount: number;
  unitPrice: number;
  originalPrice: number;
  product: {
    id: number;
    name: string;
    price: string;
    partNumber: string;
    images?: { image: string }[];
  };
  buyer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  order?: {
    id: number;
    orderNumber: string;
    shippingCost: number;
    total: number;
    shippingMethod: string;
    shippingAddress: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    status: string;
    paymentMethod?: {
      id: number;
      name: string;
    };
  };
  // The order status will be inherited from the Order table via buyerId and saleDate
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Helper function to get current date in YYYY-MM-DD format using local time
  const getCurrentLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // New Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedPurchase, setSelectedPurchase] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { notify } = useNotify()

  useEffect(() => {
    fetchSales();
  }, [statusFilter, paymentMethodFilter, dateRange]); // eslint-disable-line

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Asegurar que se envían todos los filtros correctamente
      if (statusFilter && statusFilter !== '') params.append('status', statusFilter);
      if (paymentMethodFilter && paymentMethodFilter !== '') params.append('paymentMethod', paymentMethodFilter);


      // Asegurar que las fechas se envían en formato YYYY-MM-DD
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        const formattedStart = startDate.toISOString().split('T')[0];
        params.append('startDate', formattedStart);
      }

      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        const formattedEnd = endDate.toISOString().split('T')[0];
        params.append('endDate', formattedEnd);
      }

      // Construir URL completa para logging
      const fullUrl = `${apiUrl}/sales?${params.toString()}`;

      const response = await request.get(fullUrl);
      console.log("fetchin de sales con parametros", response.data)

      // Verificar si la respuesta tiene un campo success
      if (response.data && typeof response.data === 'object') {
        if (response.data.success === false) {
          console.error('La API devolvió un error:', response.data.message);
          notify.error(response.data.message || 'Error al obtener las ventas');
          setSales([]);
          return;
        }
      }

      // Usar la misma estructura que Purchases.tsx
      if (response.data && response.data.body && Array.isArray(response.data.body.sales)) {
        setSales(response.data.body.sales);
      } else if (response.data && response.data.body && response.data.body.sales) {
        // Si sales existe pero no es un array, intentar convertirlo
        try {
          const salesArray = Array.isArray(response.data.body.sales) ? response.data.body.sales : [response.data.body.sales];
          setSales(salesArray);
        } catch (e) {
          setSales([]);
          notify.info('No se encontraron registros de ventas con los filtros actuales');
        }
      } else {
        setSales([]);
        notify.info('No se encontraron registros de ventas con los filtros actuales');
      }
    } catch (error: any) {

      // Mostrar mensaje de error más específico
      let errorMessage = 'Error al cargar el registro de ventas';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        // Manejo especial para error de token inválido
        if (errorMessage.includes('token')) {
          errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      notify.error(errorMessage);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Group sales by buyerId and saleDate to match orders from the new Order table
  // Each group represents an order with multiple products
  const groupedSales = useMemo(() => {
    const groups: { [key: string]: Sale[] } = {};

    sales.forEach(sale => {
      // Create a key based on buyerId and date (minute precision) - this represents an "order"
      const date = new Date(sale.saleDate);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      const groupKey = `${sale.buyerId}_${dateKey}`;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(sale);
    });

    return Object.values(groups).sort((a, b) =>
      new Date(b[0].saleDate).getTime() - new Date(a[0].saleDate).getTime()
    );
  }, [sales]);

  // Filter sales after grouping
  const filteredSales = groupedSales.filter(group => {
    const groupText = `${group[0].buyer?.name || ''} ${group[0].product?.name || ''} ${group[0].referenceNumber || ''}`;
    return groupText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Agregar efecto para verificar el estado de sales y filteredSales
  useEffect(() => {
    console.log('--- VERIFICACIÓN DE VENTAS ---');
    console.log('Ventas recibidas del backend:', sales);
    console.log('Cantidad de ventas:', sales.length);

    // Verificar la estructura de algunas ventas
    if (sales.length > 0) {
      console.log('Estructura de la primera venta:', sales[0]);
      console.log('¿Tiene order?:', !!sales[0].order);
      console.log('¿Tiene buyer?:', !!sales[0].buyer);
      console.log('¿Tiene product?:', !!sales[0].product);
    }

    console.log('Ventas agrupadas:', groupedSales);
    console.log('Cantidad de ventas agrupadas:', groupedSales.length);
    console.log('Resultado filteredSales:', filteredSales);
    console.log('Cantidad de ventas filtradas:', filteredSales.length);
    console.log('Término de búsqueda actual:', searchTerm);
    console.log('--- FIN VERIFICACIÓN ---');
  }, [sales, searchTerm, groupedSales, filteredSales]);

  const clearFilters = () => {
    const today = getCurrentLocalDate();
    setStatusFilter('');
    setPaymentMethodFilter('');
    setDateRange({ start: today, end: today });
    setSearchTerm('');
  };

  const handleUpdateStatus = async (saleId: number, newStatus: string) => {
    try {
      await request.put(`${apiUrl}/sales/${saleId}`, { status: newStatus });
      fetchSales(); // Refresh list
    } catch (error) {
      console.error('Error updating sale status:', error);
      notify.error('Error al actualizar el estado de la venta');
    }
  };

  /* const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Completada</span>;
      case 'pending':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14} /> Pendiente</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14} /> Cancelada</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  }; */

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Registro de Ventas</h1>
          <p className="text-gray-500 mt-1">Monitorea y gestiona las transacciones de la plataforma</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showFilters || statusFilter || paymentMethodFilter || dateRange.start
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Filter size={18} />
            <span className="font-medium">Filtros</span>
            {(statusFilter || paymentMethodFilter || dateRange.start) && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-white text-[10px] rounded-full">!</span>
            )}
          </button>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por producto, cliente o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Método de Pago</label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              >
                <option value="">Todos los métodos</option>
                <option value="Pago Movil">Pago Móvil</option>
                <option value="Zelle">Zelle</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Desde</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Hasta</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Cargando registro de ventas...</p>
        </div>
      ) : filteredSales.length > 0 ? (
        <div className="grid gap-4 md:gap-6">
          {filteredSales.map((group, index) => {
            const mainSale = group[0];
            console.log("group", group);
            // Use pre-calculated total from Order table if available, otherwise calculate it
            const totalAmount = mainSale.order?.total || group.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
            const totalItems = group.reduce((sum, item) => sum + item.quantity, 0);

            // Define status color classes similar to Purchases.tsx
            const getStatusColor = (status: string) => {
              switch (status.toLowerCase()) {
                case 'completed': return 'bg-green-100 text-green-700 border-green-200';
                case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
                default: return 'bg-gray-100 text-gray-700 border-gray-200';
              }
            };

            const translateStatus = (status: string) => {
              switch (status.toLowerCase()) {
                case 'completed': return 'Completada';
                case 'pending': return 'Pendiente';
                case 'cancelled': return 'Cancelada';
                default: return status;
              }
            };

            const openModal = () => {
              setSelectedPurchase(mainSale);
              setIsModalOpen(true);
            };

            return (
              <div
                key={index}
                onClick={openModal}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    {/* Product Image Stack */}
                    <div className="w-full md:w-32 h-24 md:h-32 shrink-0 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {group.slice(0, 3).map((item, i) => {
                          console.log("images product: ", item);
                          return <img
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
                        })}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                            {group.length > 1
                              ? `Pedido de ${group.length} productos`
                              : mainSale.product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
                            <span>Cliente: {mainSale.buyer.name}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{totalItems} artículos en total</span>
                          </div>
                        </div>
                        <div className={`self-start sm:self-center px-3 py-1 rounded-full md:text-xs font-black border uppercase tracking-wider ${getStatusColor(mainSale.status ? mainSale.status : "")}`}>
                          {translateStatus(mainSale.status || '')}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                        <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                          <span className="font-semibold">
                            {new Date(mainSale.saleDate).toLocaleDateString()}
                            <span className="ml-1 text-gray-400">
                              {new Date(mainSale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                          <CreditCard className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                          <span className="font-semibold uppercase">{mainSale.order?.paymentMethod?.name || mainSale.paymentMethod}</span>
                        </div>
                        {mainSale.order?.orderNumber && (
                          <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                            <Hash className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                            <span className="font-semibold">{mainSale.order.orderNumber}</span>
                          </div>
                        )}
                        {mainSale.referenceNumber && (
                          <div className="flex items-center text-gray-500 bg-gray-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                            <Hash className="w-3.5 h-3.5 mr-1.5 md:mr-2 text-red-500" />
                            <span className="font-semibold">{mainSale.referenceNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-gray-400 text-xs md:text-sm font-medium">Total:</span>
                          <FormattedPrice
                            price={totalAmount}
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
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay registros de ventas</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm ? 'No hay resultados para tu búsqueda actual.' : 'Aún no se han realizado ventas en la plataforma.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 text-red-600 font-semibold hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedPurchase && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 truncate">Detalles del Pedido</h2>
                <p className="text-gray-500 text-xs md:text-sm font-medium">
                  {new Date(selectedPurchase.saleDate).toLocaleDateString()} a las {new Date(selectedPurchase.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* Order Status */}
              {(() => {
                const currentGroup = groupedSales.find(g =>
                  g[0].buyerId === selectedPurchase.buyerId &&
                  new Date(g[0].saleDate).getTime() === new Date(selectedPurchase.saleDate).getTime()
                );

                if (!currentGroup) return null;

                // In the new structure, we update the order status in the Order table
                // This will automatically affect all sales in the order via buyerId relationship
                const handleUpdateOrderStatus = async (newStatus: string) => {
                  try {
                    // Get the order ID from the first sale in the group (all sales in the group belong to the same order)
                    const orderId = currentGroup[0].order?.id;
                    
                    if (orderId) {
                      // First, update the order status in the Order table
                      await request.put(`${apiUrl}/orders/${orderId}`, { status: newStatus });
                    }
                    
                    // Also update all sales in the group for backward compatibility
                    await Promise.all(
                      currentGroup.map(sale => handleUpdateStatus(sale.id, newStatus))
                    );
                  } catch (error) {
                    console.error('Error updating order status:', error);
                    notify.error('Error al actualizar el estado del pedido');
                  }
                };

                // Get the order status from the Order table
                const orderStatus = currentGroup[0].order?.status || currentGroup[0].status;

                return (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">Estado del Pedido</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(() => {
                            switch (orderStatus && orderStatus.toLowerCase()) {
                              case 'completed': return 'El pedido ha sido completado';
                              case 'pending': return 'El pedido está pendiente de procesamiento';
                              case 'cancelled': return 'El pedido ha sido cancelado';
                              default: return `Estado: ${orderStatus}`;
                            }
                          })()}
                        </p>
                      </div>
                      <select
                        className="border border-gray-200 rounded px-3 py-1.5 bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
                        value={orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>
                  </div>
                );
              })()}

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-red-500" />
                  Información del la cuenta
                </h3>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="space-y-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="text-gray-500 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedPurchase.buyer.name}</p>
                        <p className="text-xs text-gray-500">ID: {selectedPurchase.buyerId}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="text-gray-500 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedPurchase.buyer.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPurchase.buyer?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Client Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-red-500" />
                  Información del Cliente
                </h3>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Nombre</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPurchase.order?.clientName || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Correo Electrónico</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPurchase.order?.clientEmail || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPurchase.order?.clientPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-red-500" />
                  Detalles de Pago
                </h3>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Método de Pago</span>
                        <span className="font-medium text-gray-900 uppercase">{selectedPurchase.order?.paymentMethod?.name || selectedPurchase.paymentMethod}</span>
                      </div>
                      {selectedPurchase.referenceNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Referencia</span>
                          <span className="font-mono font-medium text-gray-900">{selectedPurchase.referenceNumber}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fecha de Compra</span>
                        <span className="font-medium text-gray-900">{new Date(selectedPurchase.saleDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hora</span>
                        <span className="font-medium text-gray-900">{new Date(selectedPurchase.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {selectedPurchase.receiptImage && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Comprobante de Pago</h4>
                      <a
                        href={`${apiUrl}${selectedPurchase.receiptImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Ver Comprobante
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {/* Shipping Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-red-500" />
                  Información de Envío
                </h3>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dirección de Envío</span>
                      <span className="font-medium text-gray-900 max-w-[60%] text-right">{selectedPurchase.order?.shippingAddress || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Forma de Envío</span>
                      <span className="font-medium text-gray-900 uppercase">{selectedPurchase.order?.shippingMethod || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Costo de Envío</span>
                      <FormattedPrice price={selectedPurchase.order?.shippingCost || 0} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Products List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  Productos del Pedido
                </h3>

                {/* Find all sales in the same group (order) as selectedPurchase */}
                {(() => {
                  const currentGroup = groupedSales.find(g =>
                    g[0].buyerId === selectedPurchase.buyerId &&
                    new Date(g[0].saleDate).getTime() === new Date(selectedPurchase.saleDate).getTime()
                  );

                  if (!currentGroup) return null;

                  // Calculate order totals with discounts
                  const totalItems = currentGroup.reduce((sum, item) => sum + item.quantity, 0);
                  // Calculate subtotal using unitPrice (with discount already applied)
                  const subtotal = currentGroup.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
                  // Get shipping cost from the order if available, otherwise assume 0
                  const shippingCost = selectedPurchase.order?.shippingCost || 0;
                  // Use pre-calculated total from Order table if available, otherwise calculate it
                  const totalAmount = selectedPurchase.order?.total || subtotal + shippingCost;

                  return (
                    <div className="space-y-3">
                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Número de Pedido</p>
                            <p className="text-sm font-semibold text-gray-900">{currentGroup[0].order?.orderNumber || `${currentGroup[0].buyerId}-${new Date(currentGroup[0].saleDate).getTime()}`}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fecha y Hora</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {new Date(currentGroup[0].saleDate).toLocaleDateString()} {new Date(currentGroup[0].saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total de Artículos</p>
                            <p className="text-sm font-semibold text-gray-900">{totalItems}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Método de Pago</p>
                            <p className="text-sm font-semibold text-gray-900 uppercase">{currentGroup[0].order?.paymentMethod?.name || currentGroup[0].paymentMethod}</p>
                          </div>
                        </div>
                      </div>

                      {/* Products List */}
                      <div className="space-y-2">
                        {currentGroup.map((sale) => {
                          // Calculate item discount details
                          const itemOriginalPrice = sale.originalPrice;
                          const itemFinalPrice = sale.unitPrice;
                          const itemDiscountPercent = sale.discount;

                          return (
                            <div key={sale.id} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row gap-4">
                              <div className="w-16 h-16 flex-shrink-0">
                                <img
                                  src={sale.product.images && sale.product.images.length > 0
                                    ? `${imagesUrl}${sale.product.images[0].image}`
                                    : '/placeholder-product.svg'}
                                  alt={sale.product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                                  }}
                                />
                              </div>

                              <div className="flex-1 space-y-2">
                                  <div className='flex justify-between items-start'>
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">{sale.product.name}</h4>
                                      <p className="text-xs text-gray-500">{sale.product.partNumber}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      {sale.rating !== null ? (
                                        <div className="flex flex-col items-end">
                                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-0.5">Calificación</span>
                                          <Rating
                                            hover={false}
                                            action={() => { }}
                                            stars={sale.rating}
                                          />
                                        </div>
                                      ) : (
                                        <span className="bg-yellow-200 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                                          No se ha calificado aún
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="text-gray-500">Cantidad: <span className="font-medium text-gray-900">{sale.quantity}</span></div>
                                      <div className="text-right">
                                        {itemDiscountPercent > 0 && (
                                          <div className="flex items-center gap-1.5">
                                            <FormattedPrice
                                              price={itemOriginalPrice}
                                              className="line-through text-gray-400 text-xs"
                                            />
                                            <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">-{itemDiscountPercent}%</span>
                                          </div>
                                        )}
                                        <FormattedPrice
                                          price={itemFinalPrice}
                                          className="text-sm font-medium text-red-600"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center">
                                    <div className="text-right">
                                      <FormattedPrice
                                        price={sale.quantity * itemFinalPrice}
                                        className="text-sm font-bold text-red-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Total with shipping */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal:</span>
                          <FormattedPrice price={subtotal} className="font-medium text-gray-900" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Costo de Envío:</span>
                          <FormattedPrice price={shippingCost} className="font-medium text-gray-900" />
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Total del Pedido:</span>
                          <FormattedPrice
                            price={totalAmount}
                            className="text-xl font-black text-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;

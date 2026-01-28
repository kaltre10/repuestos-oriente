import { useState, useEffect } from 'react';
import { Search, Loader2, ShoppingBag, User, Calendar, ExternalLink, CheckCircle, Clock, XCircle, Filter, Trash2 } from 'lucide-react';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';

const Sales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateRange, setDateRange] = useState({ 
    start: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [showFilters, setShowFilters] = useState(false);

  const { notify } = useNotify()

  useEffect(() => {
    fetchSales();
  }, [statusFilter, paymentMethodFilter, dateRange]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (paymentMethodFilter) params.append('paymentMethod', paymentMethodFilter);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await request.get(`${apiUrl}/sales?${params.toString()}`);
      
      // Verificar que la respuesta sea exitosa y contenga datos
      if (response.data.success && response.data.body && response.data.body.sales) {
        setSales(response.data.body.sales);
      } else if (response.data.body && response.data.body.sales) {
        // Si no hay campo success pero hay datos, usarlos directamente (por compatibilidad)
        setSales(response.data.body.sales);
      } else if (response.data.sales) {
        // Si los datos están directamente en response.data (estructura diferente)
        setSales(response.data.sales);
      } else {
        // Si no hay datos, establecer array vacío
        setSales([]);
        console.error('No se encontraron datos de ventas en la respuesta:', response.data);
      }
    } catch (error: any) {
      console.error('Error fetching sales:', error);
      notify.error('Error al cargar el registro de ventas');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    setStatusFilter('');
    setPaymentMethodFilter('');
    setDateRange({ start: yesterday, end: today });
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

  const filteredSales = sales.filter(sale =>
    sale.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
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
  };

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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showFilters || statusFilter || paymentMethodFilter || dateRange.start
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles Pago</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Monto Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {sale.product?.images?.[0] ? (
                            <img
                              src={`${imagesUrl}${sale.product.images[0].image}`}
                              alt={sale.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingBag size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm line-clamp-1">{sale.product?.name}</p>
                          <p className="text-xs text-gray-400">Cant: {sale.quantity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <User size={14} className="text-gray-400" /> {sale.buyer?.name}
                        </span>
                        <span className="text-xs text-gray-400">{sale.buyer?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-600 uppercase">{sale.paymentMethod}</span>
                        {sale.referenceNumber && (
                          <span className="text-xs text-gray-400 font-mono">Ref: {sale.referenceNumber}</span>
                        )}
                        {sale.receiptImage && (
                          <a
                            href={`${apiUrl}${sale.receiptImage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={12} /> Ver Comprobante
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <FormattedPrice
                          price={sale.quantity * sale.product?.price}
                          className="text-sm font-bold text-red-600"
                        />
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={10} /> {new Date(sale.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-red-500 outline-none"
                        value={sale.status}
                        onChange={(e) => handleUpdateStatus(sale.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
};

export default Sales;

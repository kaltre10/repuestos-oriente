import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Calendar, Clock, ChevronRight, AlertCircle, ExternalLink } from 'lucide-react';
import useStore from '../../states/global';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';
import { Link } from 'react-router-dom';

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
  const { user } = useStore();
  const [purchases, setPurchases] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await request.get(`${apiUrl}/sales/user/${user.id}`);
        console.log("response: ", response)
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

    fetchPurchases();
  }, [user]);

  console.log(purchases)

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
          <p className="text-gray-500 font-medium">Tienes un total de {purchases.length} pedidos realizados</p>
        </div>
        <div className="bg-red-50 p-3 rounded-2xl">
          <Package className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="grid gap-6">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Product Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0 relative">
                  <img
                    src={purchase.product.images && purchase.product.images.length > 0
                      ? `${imagesUrl}${purchase.product.images[0].image}`
                      : 'https://via.placeholder.com/150'}
                    alt={purchase.product.name}
                    className="w-full h-full object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {purchase.quantity}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                        {purchase.product.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Ref: {purchase.product.partNumber || 'N/A'}
                      </p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${getStatusColor(purchase.status)}`}>
                      {translateStatus(purchase.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" />
                      <span className="font-semibold">{new Date(purchase.saleDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 mr-2 text-red-500" />
                      <span className="font-semibold">{new Date(purchase.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400 text-sm font-medium">Total pagado:</span>
                      <span className="text-2xl font-black text-red-600">${(purchase.product.price * purchase.quantity).toFixed(2)}</span>
                    </div>
                    <Link to={`/producto/${purchase.productId}`}
                      className="flex items-center text-gray-400 hover:text-red-600 font-bold text-sm transition-colors"
                    >
                      Ver producto
                      <ExternalLink className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>

                {/* Arrow Icon for Desktop */}
                <div className="hidden md:flex items-center justify-center pl-4 border-l border-gray-50">
                  <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Purchases;

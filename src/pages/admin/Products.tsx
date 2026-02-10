import { useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import ProductModal from '../../components/modals/ProductModal';
import FormattedPrice from '../../components/FormattedPrice';

interface Product {
  id: number,
  name: string,
  brand: string,
  partNumber: string,
  price: number,
  amount: number,
  isActive: boolean
}

const Products = () => {
  const {
    products,
    loading,
    handleDelete,
    handleEdit,
    setShowForm,
    getProducts
  } = useProducts();

  useEffect(() => {
    getProducts({ limit: 20, showInactive: true });
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestión de Productos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <FaPlus />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Número de Parte
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product: Product) => (
                <tr key={String(product.id)} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{String(product.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.partNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    <FormattedPrice price={product.price} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {String(product.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.isActive ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product as any)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {products.map((product: Product) => (
            <div key={String(product.id)} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">ID #{product.id}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
                    {product.isActive ? (
                      <span className="w-2 h-2 rounded-full bg-green-500" title="Activo"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500" title="Inactivo"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{product.brand} • {product.partNumber}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(product as any)}
                    className="p-2.5 text-blue-600 bg-blue-50 rounded-xl active:bg-blue-100 transition-colors"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2.5 text-red-600 bg-red-50 rounded-xl active:bg-red-100 transition-colors"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Precio</span>
                  <span className="font-bold text-gray-900">
                    <FormattedPrice price={product.price} />
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Stock</span>
                  <span className={`font-bold ${product.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.amount} uds.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlus className="text-gray-300 text-xl" />
            </div>
            <p className="text-gray-500 font-medium">No hay productos registrados</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-500 text-sm font-semibold hover:underline"
            >
              Crear primer producto
            </button>
          </div>
        )}
      </div>

      <ProductModal />
    </div>
  );
};

export default Products;

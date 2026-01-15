import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import ProductModal from '../../components/modals/ProductModal';

interface Product {
  id: Number,
  name: String,
  brand: String,
  partNumber: String,
  price: Number,
  amount: Number
}

const Products = () => {
  const {
    products,
    loading,
    handleDelete,
    handleEdit,
    setShowForm,
  } = useProducts();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Parte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: Product) => (
              <tr key={String(product.id)} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {String(product.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.partNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${String(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {String(product.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos registrados</p>
          </div>
        )}
      </div>

      <ProductModal />

    </div>
  );
};

export default Products;

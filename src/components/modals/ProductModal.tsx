import { useEffect, useRef } from 'react';
import { useProducts } from '../../hooks/useProducts';

const ProductModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    showForm,
    editingProduct,
    formData,
    formLoading,
    formError,
    handleCloseForm,
    handleSubmit,
    handleInputChange,
  } = useProducts();

  // Scroll to top when form error occurs
  useEffect(() => {
    if (formError && modalRef.current) {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [formError]);

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-modal flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          formError ? 'border-2 border-red-500' : ''
        }`}
      >
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca del vehiculo*
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa la marca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca del Producto *
              </label>
              <input
                type="text"
                name="productBrand"
                value={formData.productBrand}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa la marca del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Parte *
              </label>
              <input
                type="text"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el número de parte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorías *
              </label>
              <input
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa las categorías"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Años *
              </label>
              <input
                type="text"
                name="years"
                value={formData.years}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa los años (ej: 2020-2024)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="freeDelivery"
                checked={formData.freeDelivery}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Envío gratuito
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa la descripción del producto"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              disabled={formLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {formLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {editingProduct ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

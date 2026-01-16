import React, { useState } from 'react';
import { FaCar, FaPlus, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useBrands } from '../../hooks/useBrands';

const BrandsConfig = () => {
  const { 
    brands, 
    loading: loadingBrands, 
    error: errorBrands, 
    addBrand, 
    updateBrand, 
    deleteBrand 
  } = useBrands();

  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [editingBrandName, setEditingBrandName] = useState('');

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const success = await addBrand(newBrandName);
    if (success) {
      setNewBrandName('');
    }
  };

  const handleUpdateBrand = async (id: number) => {
    if (!editingBrandName.trim()) return;
    const success = await updateBrand(id, editingBrandName);
    if (success) {
      setEditingBrandId(null);
      setEditingBrandName('');
    }
  };

  const handleDeleteBrand = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
      await deleteBrand(id);
    }
  };

  const startEditingBrand = (brand: { id: number, brand: string }) => {
    setEditingBrandId(brand.id);
    setEditingBrandName(brand.brand);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-700 flex items-center">
          <FaCar className="mr-2 text-blue-600" />
          Marcas de Vehículos
        </h2>
      </div>

      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario a la izquierda */}
          <div className="lg:w-1/3">
            <form onSubmit={handleAddBrand}>
              <label htmlFor="newBrand" className="block text-xs font-medium text-gray-700 mb-1">
                Agregar Nueva Marca
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newBrand"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm h-[38px]"
                  placeholder="Ej: Toyota"
                  disabled={loadingBrands}
                />
                <button
                  type="submit"
                  disabled={loadingBrands || !newBrandName.trim()}
                  className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white h-[38px] ${
                    loadingBrands || !newBrandName.trim() ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  } transition-colors duration-200`}
                >
                  <FaPlus />
                </button>
              </div>
              {errorBrands && !editingBrandId && <p className="mt-2 text-xs text-red-600">{errorBrands}</p>}
            </form>
          </div>

          {/* Lista a la derecha */}
          <div className="lg:w-2/3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Marcas Registradas</h3>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {brands.length === 0 && !loadingBrands ? (
                  <p className="p-4 text-center text-gray-500 text-xs italic col-span-full">No hay marcas.</p>
                ) : (
                  brands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100">
                      {editingBrandId === brand.id ? (
                        <div className="flex-1 flex gap-1 items-center">
                          <input
                            type="text"
                            value={editingBrandName}
                            onChange={(e) => setEditingBrandName(e.target.value)}
                            className="block w-full px-2 py-1 border border-blue-500 rounded-md text-xs focus:outline-none h-7"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateBrand(brand.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <FaCheck size={14} />
                          </button>
                          <button
                            onClick={() => setEditingBrandId(null)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-gray-800 truncate mr-2">{brand.brand}</span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditingBrand(brand)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
                {loadingBrands && (
                  <div className="p-4 text-center text-gray-500 text-xs col-span-full">Cargando...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsConfig;

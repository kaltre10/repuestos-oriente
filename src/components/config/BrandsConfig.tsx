import React, { useState } from 'react';
import { Car, Plus, Check, X, Pencil, Trash2, Search } from 'lucide-react';
import { useBrands } from '../../hooks/useBrands';
import { useConfirm } from '../../hooks/useConfirm';

const BrandsConfig = () => {
  const {
    brands,
    loading: loadingBrands,
    error: errorBrands,
    addBrand,
    updateBrand,
    deleteBrand
  } = useBrands();

  const confirm = useConfirm()

  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [editingBrandName, setEditingBrandName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(b => 
    b.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const respuesta = await confirm('¿Estás seguro de que deseas eliminar esta marca?');
    if (respuesta) {
      await deleteBrand(id);
    }
  };

  const startEditingBrand = (brand: { id: number, brand: string }) => {
    setEditingBrandId(brand.id);
    setEditingBrandName(brand.brand);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="bg-gray-50/50 px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-600" />
          Marcas de Vehículos
        </h2>
        <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full self-start sm:self-auto">
          {brands.length} Total
        </span>
      </div>

      <div className="p-4 md:p-6 space-y-6 flex flex-col">
        {/* Formulario de Agregar */}
        <form onSubmit={handleAddBrand} className="space-y-1.5">
          <label htmlFor="newBrand" className="block text-sm font-semibold text-gray-700">
            Agregar Nueva Marca
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                id="newBrand"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                placeholder="Ej: Toyota"
                disabled={loadingBrands}
              />
            </div>
            <button
              type="submit"
              disabled={loadingBrands || !newBrandName.trim()}
              className="flex items-center justify-center px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-all active:scale-95 shadow-sm shadow-green-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {errorBrands && !editingBrandId && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full" />
              {errorBrands}
            </p>
          )}
        </form>

        {/* Buscador y Lista */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Marcas Registradas</h3>
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/30 max-h-[400px]">
            {filteredBrands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 space-y-2">
                <Car className="w-8 h-8 opacity-20" />
                <p className="text-sm italic">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay marcas registradas'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 divide-y divide-gray-100">
                {filteredBrands.map((brand) => (
                  <div key={brand.id} className="group flex items-center justify-between p-3 hover:bg-white transition-colors">
                    {editingBrandId === brand.id ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <input
                          type="text"
                          value={editingBrandName}
                          onChange={(e) => setEditingBrandName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-blue-500 rounded-lg text-sm focus:outline-none shadow-sm shadow-blue-100"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateBrand(brand.id);
                            if (e.key === 'Escape') setEditingBrandId(null);
                          }}
                        />
                        <button
                          onClick={() => handleUpdateBrand(brand.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingBrandId(null)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          {brand.brand}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditingBrand(brand)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(brand.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Mobile controls always visible */}
                        <div className="flex gap-2 md:hidden">
                          <button
                            onClick={() => startEditingBrand(brand)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(brand.id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            {loadingBrands && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsConfig;

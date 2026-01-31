import React, { useState } from 'react';
import { Layers, Plus, Check, X, Pencil, Trash2, Search } from 'lucide-react';
import { useModels } from '../../hooks/useModels';
import { useBrands } from '../../hooks/useBrands';
import { useConfirm } from '../../hooks/useConfirm';

const ModelsConfig = () => {
  const confirm = useConfirm();
  const { 
    brands, 
    loading: loadingBrands 
  } = useBrands();

  const {
    models,
    loading: loadingModels,
    error: errorModels,
    addModel,
    updateModel,
    deleteModel
  } = useModels();

  const [newModelName, setNewModelName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [editingModelId, setEditingModelId] = useState<number | null>(null);
  const [editingModelName, setEditingModelName] = useState('');
  const [editingModelBrandId, setEditingModelBrandId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = models.filter(m => 
    m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand?.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim() || !selectedBrandId) return;
    const success = await addModel(newModelName, parseInt(selectedBrandId));
    if (success) {
      setNewModelName('');
      setSelectedBrandId('');
    }
  };

  const handleUpdateModel = async (id: number) => {
    if (!editingModelName.trim() || !editingModelBrandId) return;
    const success = await updateModel(id, editingModelName, editingModelBrandId);
    if (success) {
      setEditingModelId(null);
      setEditingModelName('');
    }
  };

  const handleDeleteModel = async (id: number) => {
    const respuesta = await confirm('¿Estás seguro de que deseas eliminar este modelo?');
    if (respuesta) {
      await deleteModel(id);
    }
  };

  const startEditingModel = (model: any) => {
    setEditingModelId(model.id);
    setEditingModelName(model.model);
    setEditingModelBrandId(model.brandId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" />
          Modelos de Vehículos
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
          {models.length} Total
        </span>
      </div>

      <div className="p-6 space-y-6 flex flex-col">
        {/* Formulario de Agregar */}
        <form onSubmit={handleAddModel} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="brandSelect" className="block text-sm font-semibold text-gray-700">
                Seleccionar Marca
              </label>
              <select
                id="brandSelect"
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                disabled={loadingModels || loadingBrands}
              >
                <option value="">Seleccione una marca</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.brand}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="newModel" className="block text-sm font-semibold text-gray-700">
                Nombre del Modelo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newModel"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                  placeholder="Ej: Corolla"
                  disabled={loadingModels}
                />
                <button
                  type="submit"
                  disabled={loadingModels || !newModelName.trim() || !selectedBrandId}
                  className="flex items-center justify-center px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-all active:scale-95 shadow-sm shadow-green-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          {errorModels && !editingModelId && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full" />
              {errorModels}
            </p>
          )}
        </form>

        {/* Buscador y Lista */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Modelos Registrados</h3>
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar por modelo o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/30 max-h-[400px]">
            {filteredModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 space-y-2">
                <Layers className="w-8 h-8 opacity-20" />
                <p className="text-sm italic">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay modelos registrados'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-100">
                {filteredModels.map((model) => (
                  <div key={model.id} className="group flex items-center justify-between p-3 hover:bg-white transition-colors">
                    {editingModelId === model.id ? (
                      <div className="flex-1 space-y-2">
                        <select
                          value={editingModelBrandId}
                          onChange={(e) => setEditingModelBrandId(parseInt(e.target.value))}
                          className="block w-full px-3 py-1.5 bg-white border border-blue-500 rounded-lg text-xs focus:outline-none shadow-sm shadow-blue-100"
                        >
                          {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.brand}</option>
                          ))}
                        </select>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={editingModelName}
                            onChange={(e) => setEditingModelName(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-blue-500 rounded-lg text-sm focus:outline-none shadow-sm shadow-blue-100"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateModel(model.id);
                              if (e.key === 'Escape') setEditingModelId(null);
                            }}
                          />
                          <button
                            onClick={() => handleUpdateModel(model.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingModelId(null)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col truncate mr-2">
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                            {model.model}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {model.brand?.brand}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => startEditingModel(model)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteModel(model.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Mobile controls */}
                        <div className="flex gap-2 md:hidden shrink-0">
                          <button
                            onClick={() => startEditingModel(model)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteModel(model.id)}
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
            {loadingModels && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelsConfig;

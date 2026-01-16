import React, { useState } from 'react';
import { FaLayerGroup, FaPlus, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useModels } from '../../hooks/useModels';
import { useBrands } from '../../hooks/useBrands';

const ModelsConfig = () => {
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
    if (window.confirm('¿Estás seguro de que deseas eliminar este modelo?')) {
      await deleteModel(id);
    }
  };

  const startEditingModel = (model: any) => {
    setEditingModelId(model.id);
    setEditingModelName(model.model);
    setEditingModelBrandId(model.brandId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-700 flex items-center">
          <FaLayerGroup className="mr-2 text-purple-600" />
          Modelos de Vehículos
        </h2>
      </div>

      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario a la izquierda */}
          <div className="lg:w-1/3 space-y-3">
            <form onSubmit={handleAddModel} className="space-y-3">
              <div>
                <label htmlFor="brandSelect" className="block text-xs font-medium text-gray-700 mb-1">
                  Seleccionar Marca
                </label>
                <select
                  id="brandSelect"
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm h-[38px]"
                  disabled={loadingModels || loadingBrands}
                >
                  <option value="">Seleccione una marca</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="newModel" className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre del Modelo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newModel"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm h-[38px]"
                    placeholder="Ej: Corolla"
                    disabled={loadingModels}
                  />
                  <button
                    type="submit"
                    disabled={loadingModels || !newModelName.trim() || !selectedBrandId}
                    className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white h-[38px] ${
                      loadingModels || !newModelName.trim() || !selectedBrandId ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    } transition-colors duration-200`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              {errorModels && !editingModelId && <p className="mt-2 text-xs text-red-600">{errorModels}</p>}
            </form>
          </div>

          {/* Lista a la derecha */}
          <div className="lg:w-2/3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Modelos Registrados</h3>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {models.length === 0 && !loadingModels ? (
                  <p className="p-4 text-center text-gray-500 text-xs italic col-span-full">No hay modelos.</p>
                ) : (
                  models.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100">
                      {editingModelId === model.id ? (
                        <div className="flex-1 space-y-2">
                          <select
                            value={editingModelBrandId}
                            onChange={(e) => setEditingModelBrandId(parseInt(e.target.value))}
                            className="block w-full px-2 py-1 border border-blue-500 rounded-md text-xs focus:outline-none"
                          >
                            {brands.map(brand => (
                              <option key={brand.id} value={brand.id}>{brand.brand}</option>
                            ))}
                          </select>
                          <div className="flex gap-1 items-center">
                            <input
                              type="text"
                              value={editingModelName}
                              onChange={(e) => setEditingModelName(e.target.value)}
                              className="block w-full px-2 py-1 border border-blue-500 rounded-md text-xs focus:outline-none h-7"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateModel(model.id)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <FaCheck size={14} />
                            </button>
                            <button
                              onClick={() => setEditingModelId(null)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col truncate mr-2">
                            <span className="text-sm font-medium text-gray-800 truncate">{model.model}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{model.brand?.brand}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditingModel(model)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteModel(model.id)}
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
                {loadingModels && (
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

export default ModelsConfig;

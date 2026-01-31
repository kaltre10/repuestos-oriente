import React, { useState } from 'react';
import { Layers, Plus, Check, X, Pencil, Trash2, Search } from 'lucide-react';
import { useSubCategories } from '../../hooks/useSubCategories';
import { useCategories } from '../../hooks/useCategories';
import { useConfirm } from '../../hooks/useConfirm';

const SubCategoriesConfig = () => {
  const confirm = useConfirm()
  const {
    categories,
    loading: loadingCategories
  } = useCategories();

  const {
    subCategories,
    loading: loadingSubCategories,
    error: errorSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useSubCategories();

  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<number | null>(null);
  const [editingSubCategoryName, setEditingSubCategoryName] = useState('');
  const [editingSubCategoryCategoryId, setEditingSubCategoryCategoryId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubCategories = subCategories.filter(s => 
    s.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCategoryName.trim() || !selectedCategoryId) return;
    const success = await addSubCategory(newSubCategoryName, parseInt(selectedCategoryId));
    if (success) {
      setNewSubCategoryName('');
      setSelectedCategoryId('');
    }
  };

  const handleUpdateSubCategory = async (id: number) => {
    if (!editingSubCategoryName.trim() || !editingSubCategoryCategoryId) return;
    const success = await updateSubCategory(id, editingSubCategoryName, editingSubCategoryCategoryId);
    if (success) {
      setEditingSubCategoryId(null);
      setEditingSubCategoryName('');
    }
  };

  const handleDeleteSubCategory = async (id: number) => {
    const respuesta = await confirm('¿Estás seguro de que deseas eliminar esta subcategoría?');
    if (respuesta) {
      await deleteSubCategory(id);
    }
  };

  const startEditingSubCategory = (subCat: any) => {
    setEditingSubCategoryId(subCat.id);
    setEditingSubCategoryName(subCat.subCategory);
    setEditingSubCategoryCategoryId(subCat.categoryId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Subcategorías de Productos
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
          {subCategories.length} Total
        </span>
      </div>

      <div className="p-6 space-y-6 flex flex-col">
        {/* Formulario de Agregar */}
        <form onSubmit={handleAddSubCategory} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="categorySelect" className="block text-sm font-semibold text-gray-700">
                Seleccionar Categoría
              </label>
              <select
                id="categorySelect"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                disabled={loadingSubCategories || loadingCategories}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="newSubCategory" className="block text-sm font-semibold text-gray-700">
                Nombre de la Subcategoría
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newSubCategory"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                  placeholder="Ej: Frenos"
                  disabled={loadingSubCategories}
                />
                <button
                  type="submit"
                  disabled={loadingSubCategories || !newSubCategoryName.trim() || !selectedCategoryId}
                  className="flex items-center justify-center px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-all active:scale-95 shadow-sm shadow-green-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          {errorSubCategories && !editingSubCategoryId && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full" />
              {errorSubCategories}
            </p>
          )}
        </form>

        {/* Buscador y Lista */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Subcategorías Registradas</h3>
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar por subcategoría o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/30 max-h-[400px]">
            {filteredSubCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 space-y-2">
                <Layers className="w-8 h-8 opacity-20" />
                <p className="text-sm italic">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay subcategorías registradas'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-100">
                {filteredSubCategories.map((subCat) => (
                  <div key={subCat.id} className="group flex items-center justify-between p-3 hover:bg-white transition-colors">
                    {editingSubCategoryId === subCat.id ? (
                      <div className="flex-1 space-y-2">
                        <select
                          value={editingSubCategoryCategoryId}
                          onChange={(e) => setEditingSubCategoryCategoryId(parseInt(e.target.value))}
                          className="block w-full px-3 py-1.5 bg-white border border-blue-500 rounded-lg text-xs focus:outline-none shadow-sm shadow-blue-100"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.category}</option>
                          ))}
                        </select>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={editingSubCategoryName}
                            onChange={(e) => setEditingSubCategoryName(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-blue-500 rounded-lg text-sm focus:outline-none shadow-sm shadow-blue-100"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateSubCategory(subCat.id);
                              if (e.key === 'Escape') setEditingSubCategoryId(null);
                            }}
                          />
                          <button
                            onClick={() => handleUpdateSubCategory(subCat.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingSubCategoryId(null)}
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
                            {subCat.subCategory}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {subCat.category?.category}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => startEditingSubCategory(subCat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(subCat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Mobile controls */}
                        <div className="flex gap-2 md:hidden shrink-0">
                          <button
                            onClick={() => startEditingSubCategory(subCat)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(subCat.id)}
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
            {loadingSubCategories && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoriesConfig;

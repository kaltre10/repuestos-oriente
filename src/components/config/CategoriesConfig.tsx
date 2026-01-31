import React, { useState } from 'react';
import { Tags, Plus, Check, X, Pencil, Trash2, Search } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useConfirm } from '../../hooks/useConfirm';

const CategoriesConfig = () => {
  const confirm = useConfirm();
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(c => 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const success = await addCategory(newCategoryName);
    if (success) {
      setNewCategoryName('');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCategoryName.trim()) return;
    const success = await updateCategory(id, editingCategoryName);
    if (success) {
      setEditingCategoryId(null);
      setEditingCategoryName('');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const respuesta = await confirm('¿Estás seguro de que deseas eliminar esta categoría?');
    if (respuesta) {
      await deleteCategory(id);
    }
  };

  const startEditingCategory = (category: { id: number, category: string }) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.category);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Tags className="w-5 h-5 text-orange-600" />
          Categorías de Vehículos
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
          {categories.length} Total
        </span>
      </div>

      <div className="p-6 space-y-6 flex flex-col">
        {/* Formulario de Agregar */}
        <form onSubmit={handleAddCategory} className="space-y-1.5">
          <label htmlFor="newCategory" className="block text-sm font-semibold text-gray-700">
            Agregar Nueva Categoría
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                placeholder="Ej: Camioneta"
                disabled={loadingCategories}
              />
            </div>
            <button
              type="submit"
              disabled={loadingCategories || !newCategoryName.trim()}
              className="flex items-center justify-center px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-all active:scale-95 shadow-sm shadow-green-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {errorCategories && !editingCategoryId && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full" />
              {errorCategories}
            </p>
          )}
        </form>

        {/* Buscador y Lista */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Categorías Registradas</h3>
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
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 space-y-2">
                <Tags className="w-8 h-8 opacity-20" />
                <p className="text-sm italic">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay categorías registradas'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-gray-100">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="group flex items-center justify-between p-3 hover:bg-white transition-colors">
                    {editingCategoryId === cat.id ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-blue-500 rounded-lg text-sm focus:outline-none shadow-sm shadow-blue-100"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateCategory(cat.id);
                            if (e.key === 'Escape') setEditingCategoryId(null);
                          }}
                        />
                        <button
                          onClick={() => handleUpdateCategory(cat.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          {cat.category}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditingCategory(cat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Mobile controls */}
                        <div className="flex gap-2 md:hidden">
                          <button
                            onClick={() => startEditingCategory(cat)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
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
            {loadingCategories && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-orange-600/30 border-t-orange-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesConfig;

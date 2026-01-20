import React, { useState } from 'react';
import { FaTags, FaPlus, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-700 flex items-center">
          <FaTags className="mr-2 text-orange-600" />
          Categorías de Vehículos
        </h2>
      </div>

      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario a la izquierda */}
          <div className="lg:w-1/3">
            <form onSubmit={handleAddCategory}>
              <label htmlFor="newCategory" className="block text-xs font-medium text-gray-700 mb-1">
                Agregar Nueva Categoría
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newCategory"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm h-[38px]"
                  placeholder="Ej: Camioneta"
                  disabled={loadingCategories}
                />
                <button
                  type="submit"
                  disabled={loadingCategories || !newCategoryName.trim()}
                  className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white h-[38px] ${
                    loadingCategories || !newCategoryName.trim() ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  } transition-colors duration-200`}
                >
                  <FaPlus />
                </button>
              </div>
              {errorCategories && !editingCategoryId && <p className="mt-2 text-xs text-red-600">{errorCategories}</p>}
            </form>
          </div>

          {/* Lista a la derecha */}
          <div className="lg:w-2/3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Categorías Registradas</h3>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {categories.length === 0 && !loadingCategories ? (
                  <p className="p-4 text-center text-gray-500 text-xs italic col-span-full">No hay categorías.</p>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100">
                      {editingCategoryId === cat.id ? (
                        <div className="flex-1 flex gap-1 items-center">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="block w-full px-2 py-1 border border-blue-500 rounded-md text-xs focus:outline-none h-7"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateCategory(cat.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <FaCheck size={14} />
                          </button>
                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-gray-800 truncate mr-2">{cat.category}</span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditingCategory(cat)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
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
                {loadingCategories && (
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

export default CategoriesConfig;

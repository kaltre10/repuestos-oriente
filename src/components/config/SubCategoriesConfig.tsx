import React, { useState } from 'react';
import { FaLayerGroup, FaPlus, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useSubCategories } from '../../hooks/useSubCategories';
import { useCategories } from '../../hooks/useCategories';

const SubCategoriesConfig = () => {
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
    if (window.confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) {
      await deleteSubCategory(id);
    }
  };

  const startEditingSubCategory = (subCat: any) => {
    setEditingSubCategoryId(subCat.id);
    setEditingSubCategoryName(subCat.subCategory);
    setEditingSubCategoryCategoryId(subCat.categoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-700 flex items-center">
          <FaLayerGroup className="mr-2 text-indigo-600" />
          Subcategorías de Productos
        </h2>
      </div>

      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario a la izquierda */}
          <div className="lg:w-1/3 space-y-3">
            <form onSubmit={handleAddSubCategory} className="space-y-3">
              <div>
                <label htmlFor="categorySelect" className="block text-xs font-medium text-gray-700 mb-1">
                  Seleccionar Categoría
                </label>
                <select
                  id="categorySelect"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm h-[38px]"
                  disabled={loadingSubCategories || loadingCategories}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="newSubCategory" className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre de la Subcategoría
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newSubCategory"
                    value={newSubCategoryName}
                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm h-[38px]"
                    placeholder="Ej: Frenos"
                    disabled={loadingSubCategories}
                  />
                  <button
                    type="submit"
                    disabled={loadingSubCategories || !newSubCategoryName.trim() || !selectedCategoryId}
                    className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white h-[38px] ${
                      loadingSubCategories || !newSubCategoryName.trim() || !selectedCategoryId ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    } transition-colors duration-200`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              {errorSubCategories && !editingSubCategoryId && <p className="mt-2 text-xs text-red-600">{errorSubCategories}</p>}
            </form>
          </div>

          {/* Lista a la derecha */}
          <div className="lg:w-2/3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Subcategorías Registradas</h3>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {subCategories.length === 0 && !loadingSubCategories ? (
                  <p className="p-4 text-center text-gray-500 text-xs italic col-span-full">No hay subcategorías.</p>
                ) : (
                  subCategories.map((subCat) => (
                    <div key={subCat.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100">
                      {editingSubCategoryId === subCat.id ? (
                        <div className="flex-1 space-y-2">
                          <select
                            value={editingSubCategoryCategoryId}
                            onChange={(e) => setEditingSubCategoryCategoryId(parseInt(e.target.value))}
                            className="block w-full px-2 py-1 border border-blue-500 rounded-md text-xs focus:outline-none"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.category}</option>
                            ))}
                          </select>
                          <div className="flex gap-1 items-center">
                            <input
                              type="text"
                              value={editingSubCategoryName}
                              onChange={(e) => setEditingSubCategoryName(e.target.value)}
                              className="block w-full px-2 py-1 border border-blue-500 rounded-md text-xs focus:outline-none h-7"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateSubCategory(subCat.id)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <FaCheck size={14} />
                            </button>
                            <button
                              onClick={() => setEditingSubCategoryId(null)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col truncate mr-2">
                            <span className="text-sm font-medium text-gray-800 truncate">{subCat.subCategory}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{subCat.category?.category}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditingSubCategory(subCat)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubCategory(subCat.id)}
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
                {loadingSubCategories && (
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

export default SubCategoriesConfig;

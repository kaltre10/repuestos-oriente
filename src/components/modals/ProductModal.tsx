import { useEffect, useRef, useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useBrands } from '../../hooks/useBrands';
import { useModels } from '../../hooks/useModels';
import { useCategories } from '../../hooks/useCategories';
import { useSubCategories } from '../../hooks/useSubCategories';
import { useImageUpload } from '../../hooks/useImageUpload';
import ImageUploadSection from '../ImageUploadSection';
import { useConfirm } from '../../hooks/useConfirm';
import useNotify from '../../hooks/useNotify';

const ProductModal = () => {
  const { notify } = useNotify();
  const confirm = useConfirm();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; image: string }[]>([]);

  const {
    showForm,
    editingProduct,
    formData,
    formLoading,
    formError,
    handleCloseForm,
    handleSubmit,
    handleInputChange,
    setFormData,
    fieldErrors,
    getProducts, // Assuming it's exported or we can call it after submit
  } = useProducts();

  const { uploadImages, fetchProductImages, deleteImage } = useImageUpload();

  const { brands } = useBrands();
  const { models } = useModels();
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();

  // Parse categories string to array
  const selectedCategories = formData.categories
    ? formData.categories.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  // Parse subcategories string to array
  const selectedSubCategories = formData.subcategories
    ? formData.subcategories.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  // Filter available categories (those not already selected)
  const availableCategories = categories.filter(
    cat => !selectedCategories.includes(cat.category)
  );

  // Get selected category objects to filter subcategories
  const selectedCategoryObjects = categories.filter(cat => 
    selectedCategories.includes(cat.category)
  );
  
  const selectedCategoryIds = selectedCategoryObjects.map(cat => cat.id);

  // Filter available subcategories based on selected categories
  const availableSubCategories = subCategories.filter(
    sub => selectedCategoryIds.includes(sub.categoryId) && !selectedSubCategories.includes(sub.subCategory)
  );

  // Filter models based on selected brand
  const filteredModels = models.filter(m => m.brandId === parseInt(formData.brandId));

  // Load existing images when editing
  useEffect(() => {
    if (editingProduct && showForm) {
      fetchProductImages(editingProduct.id).then(imgs => {
        setExistingImages(imgs);
      });
    } else {
      setExistingImages([]);
      setSelectedFiles([]);
    }
  }, [editingProduct, showForm, fetchProductImages]);

  // Scroll to top when form error occurs
  useEffect(() => {
    if (formError && modalRef.current) {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [formError]);

  // Handle category addition
  const addCategory = (categoryName: string) => {
    const newSelected = [...selectedCategories, categoryName];
    setFormData({
      ...formData,
      categories: newSelected.join(',')
    });
  };

  // Handle category removal
  const removeCategory = (categoryName: string) => {
    const category = categories.find(c => c.category === categoryName);
    const newSelectedCategories = selectedCategories.filter(c => c !== categoryName);
    
    // Also remove subcategories that belong to this category
    const subCatsToRemove = subCategories
      .filter(sc => sc.categoryId === category?.id)
      .map(sc => sc.subCategory);
      
    const newSelectedSubCategories = selectedSubCategories.filter(
      sc => !subCatsToRemove.includes(sc)
    );

    setFormData({
      ...formData,
      categories: newSelectedCategories.join(','),
      subcategories: newSelectedSubCategories.join(',')
    });
  };

  // Handle subcategory addition
  const addSubCategory = (subCategoryName: string) => {
    const newSelected = [...selectedSubCategories, subCategoryName];
    setFormData({
      ...formData,
      subcategories: newSelected.join(',')
    });
  };

  // Handle subcategory removal
  const removeSubCategory = (subCategoryName: string) => {
    const newSelected = selectedSubCategories.filter(sc => sc !== subCategoryName);
    setFormData({
      ...formData,
      subcategories: newSelected.join(',')
    });
  };

  // Update brand and model names when IDs change
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    const selectedBrand = brands.find(b => b.id === parseInt(brandId));

    setFormData({
      ...formData,
      brandId,
      brand: selectedBrand ? selectedBrand.brand : '',
      modelId: '', // Reset model when brand changes
      model: ''
    });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    const selectedModel = models.find(m => m.id === parseInt(modelId));

    setFormData({
      ...formData,
      modelId,
      model: selectedModel ? selectedModel.model : ''
    });
  };

  // Handle years input with specific format: XXXX-XXXX
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and "-"
    const filteredValue = value.replace(/[^0-9-]/g, '');
    
    // Auto-format: Add "-" after 4 digits if not present
    let formattedValue = filteredValue;
    if (filteredValue.length === 4 && !filteredValue.includes('-') && value.length > formData.years.length) {
      formattedValue = filteredValue + '-';
    }
    
    // Limit length to 9 characters (XXXX-XXXX)
    if (formattedValue.length <= 9) {
      setFormData({
        ...formData,
        years: formattedValue
      });
    }

    // Validation check for notification (only if we have enough characters to validate a full range)
    if (formattedValue.length === 9) {
      const yearRegex = /^\d{4}-\d{4}$/;
      if (!yearRegex.test(formattedValue)) {
        notify.info('El formato correcto para los años es: 2020-2024 (4 dígitos, guion, 4 dígitos)');
      }
    }
  };

  const handleNoBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData({
      ...formData,
      noBrand: isChecked,
      brandId: isChecked ? '' : formData.brandId,
      brand: isChecked ? '' : formData.brand,
      modelId: isChecked ? '' : formData.modelId,
      model: isChecked ? '' : formData.model,
    });
  };

  const handleImagesSubmit = async (productId: number) => {
    if (selectedFiles.length > 0) {
      await uploadImages(productId, selectedFiles);
    }
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    const respuesta = await confirm('¿Estás seguro de que quieres eliminar esta imagen?');
    if (respuesta) {
      await deleteImage(imageId);
      setExistingImages(existingImages.filter(img => img.id !== imageId));
    }
  };

  const onFormSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       const productId = await handleSubmit(e);
       if (productId) {
         await handleImagesSubmit(productId);
         await getProducts();
         handleCloseForm();
       }
     } catch (error) {
       console.error("Error submitting product and images:", error);
     }
   };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-modal flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg p-6 w-full max-w-[90vw] max-h-[95vh] overflow-y-auto ${formError ? 'border-2 border-red-500' : ''
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

        <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa el nombre del producto"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.productBrand ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa la marca del producto"
            />
            {fieldErrors.productBrand && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.productBrand}</p>
            )}
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Categorías *
            </label>
            
            {/* Disponibles */}
            <div className={`flex flex-wrap gap-2 p-2 rounded-md ${fieldErrors.categories ? 'bg-red-50 border border-red-200' : ''}`}>
              {availableCategories.length > 0 ? (
                availableCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => addCategory(cat.category)}
                    className="px-3 cursor-pointer py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors border border-gray-200"
                  >
                    + {cat.category}
                  </button>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No hay más categorías disponibles</span>
              )}
            </div>

            {/* Seleccionadas */}
            <div className={`mt-2 p-3 border border-dashed rounded-md bg-gray-50 min-h-[50px] ${
              fieldErrors.categories ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map(catName => (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => removeCategory(catName)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-red-500 transition-colors flex items-center gap-1"
                    >
                      {catName}
                      <span className="font-bold">×</span>
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">Selecciona categorías arriba...</span>
                )}
              </div>
            </div>
            {fieldErrors.categories && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.categories}</p>
            )}
          </div>

          {/* Subcategorías */}
          {selectedCategories.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Subcategorías *
              </label>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        addSubCategory(e.target.value);
                        e.target.value = ''; // Reset selection
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Selecciona una subcategoría</option>
                    {availableSubCategories.length > 0 ? (
                      availableSubCategories.map(sub => (
                        <option key={sub.id} value={sub.subCategory}>
                          {sub.subCategory} ({sub.category?.category || 'N/A'})
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay más subcategorías disponibles</option>
                    )}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 flex-1 p-2 border border-dashed border-gray-300 rounded-md bg-gray-50 min-h-[42px] items-center">
                  {selectedSubCategories.length > 0 ? (
                    selectedSubCategories.map(subName => (
                      <button
                        key={subName}
                        type="button"
                        onClick={() => removeSubCategory(subName)}
                        className="px-3 py-1 text-xs bg-indigo-500 text-white rounded-full hover:bg-red-500 transition-colors flex items-center gap-1"
                      >
                        {subName}
                        <span className="font-bold">×</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Selecciona subcategorías a la izquierda...</span>
                  )}
                </div>
              </div>
              {fieldErrors.subcategories && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.subcategories}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 py-2 bg-gray-50 p-3 rounded-md border border-gray-200">
            <input
              type="checkbox"
              id="noBrand"
              name="noBrand"
              checked={formData.noBrand}
              onChange={handleNoBrandChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="noBrand" className="text-sm font-medium text-gray-700 cursor-pointer">
              Sin marca específica
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca del vehículo {formData.noBrand ? '' : '*'}
              </label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleBrandChange}
                required={!formData.noBrand}
                disabled={formData.noBrand}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  fieldErrors.brandId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una marca</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brand}
                  </option>
                ))}
              </select>
              {fieldErrors.brandId && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.brandId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo del vehículo {formData.noBrand ? '' : '*'}
              </label>
              <select
                name="modelId"
                value={formData.modelId}
                onChange={handleModelChange}
                required={!formData.noBrand}
                disabled={formData.noBrand || !formData.brandId}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  fieldErrors.modelId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {formData.noBrand ? 'N/A' : (!formData.brandId ? 'Selecciona primero una marca' : 'Selecciona un modelo')}
                </option>
                {filteredModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.model}
                  </option>
                ))}
              </select>
              {fieldErrors.modelId && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.modelId}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.partNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa el número de parte"
              />
              {fieldErrors.partNumber && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.partNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Garantía
              </label>
              <input
                type="text"
                name="garantia"
                value={formData.garantia}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.garantia ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 6 meses, 1 año, etc."
              />
              {fieldErrors.garantia && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.garantia}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Años *
              </label>
              <input
                type="text"
                name="years"
                value={formData.years}
                onChange={handleYearsChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.years ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="XXXX-XXXX"
              />
              {fieldErrors.years && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.years}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {fieldErrors.price && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {fieldErrors.amount && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>
              )}
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

          <ImageUploadSection 
            onImagesChange={setSelectedFiles}
            existingImages={existingImages}
            onDeleteExisting={handleDeleteExistingImage}
          />

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

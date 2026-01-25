import { useState, useMemo } from 'react';
import { useBrands } from '../hooks/useBrands';
import { useModels } from '../hooks/useModels';
import { useCategories } from '../hooks/useCategories';
import { useSubCategories } from '../hooks/useSubCategories';

interface ProductFiltersProps {
  selectedYear: string;
  selectedBrand: string;
  selectedModel: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onYearChange: (year: string) => void;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedYear,
  selectedBrand,
  selectedModel,
  selectedCategory,
  selectedSubcategory,
  onYearChange,
  onBrandChange,
  onModelChange,
  onCategoryChange,
  onSubcategoryChange,
  onClearFilters,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const { brands } = useBrands();
  const { models } = useModels();
  const { categories: rawCategories } = useCategories(true);
  const { subCategories: rawSubCategories } = useSubCategories(true);

  const categories = useMemo(() => {
    return [...rawCategories].sort((a, b) => a.category.localeCompare(b.category));
  }, [rawCategories]);

  const subCategories = useMemo(() => {
    return [...rawSubCategories].sort((a, b) => a.subCategory.localeCompare(b.subCategory));
  }, [rawSubCategories]);

  const years = Array.from({ length: 31 }, (_, i) => (2025 - i).toString());

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const brandObj = brands.find(b => b.brand === selectedBrand);
    if (!brandObj) return [];
    return models.filter(m => m.brandId === brandObj.id);
  }, [selectedBrand, brands, models]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="w-80 bg-white p-6 rounded-lg shadow-md h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Year Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Año</h4>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todos los años</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Marca de Vehículo</h4>
        <select
          value={selectedBrand}
          onChange={(e) => {
            onBrandChange(e.target.value);
            onModelChange(''); // Reset model when brand changes
          }}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todas las marcas</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.brand}>{brand.brand}</option>
          ))}
        </select>
      </div>

      {/* Model Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Modelo de Vehículo</h4>
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={!selectedBrand}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">{selectedBrand ? 'Todos los modelos' : 'Seleccione una marca'}</option>
          {availableModels.map(model => (
            <option key={model.id} value={model.model}>{model.model}</option>
          ))}
        </select>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Categorías</h4>
        <div>
          {categories.map((categoria) => (
            <div key={categoria.id} className="mb-2">
              <button
                onClick={() => toggleCategory(categoria.id)}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  selectedCategory === categoria.category
                    ? 'bg-red-100 text-red-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{categoria.category}</span>
                  <span className="text-sm">
                    {expandedCategories.includes(categoria.id) ? '−' : '+'}
                  </span>
                </div>
              </button>

              {expandedCategories.includes(categoria.id) && (
                <div className="ml-4 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      onCategoryChange(categoria.category);
                      onSubcategoryChange('');
                    }}
                    className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                      selectedCategory === categoria.category && !selectedSubcategory
                        ? 'bg-red-50 text-red-600'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    Ver todo en {categoria.category}
                  </button>
                  {subCategories
                    .filter(sub => sub.categoryId === categoria.id)
                    .map((subcategoria) => (
                    <button
                      key={subcategoria.id}
                      onClick={() => {
                        onCategoryChange(categoria.category);
                        onSubcategoryChange(subcategoria.subCategory);
                      }}
                      className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                        selectedCategory === categoria.category && selectedSubcategory === subcategoria.subCategory
                          ? 'bg-red-50 text-red-600'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {subcategoria.subCategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedYear || selectedBrand || selectedModel || selectedCategory) && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Filtros activos:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedYear && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                Año: {selectedYear}
              </span>
            )}
            {selectedBrand && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                Marca: {selectedBrand}
              </span>
            )}
            {selectedModel && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                Modelo: {selectedModel}
              </span>
            )}
            {selectedCategory && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                {selectedCategory}
                {selectedSubcategory && ` > ${selectedSubcategory}`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;

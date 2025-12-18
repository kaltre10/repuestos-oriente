import { useState } from 'react';
import categoriasData from '../utils/categorias.json';

interface ProductFiltersProps {
  selectedYear: string;
  selectedBrand: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onYearChange: (year: string) => void;
  onBrandChange: (brand: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedYear,
  selectedBrand,
  selectedCategory,
  selectedSubcategory,
  onYearChange,
  onBrandChange,
  onCategoryChange,
  onSubcategoryChange,
  onClearFilters,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
  const brands = ['TOYOTA', 'HONDA', 'BMW', 'FORD', 'CHEVROLET', 'VOLSWAGEN', 'NISSAN', 'MERCEDES', 'AUDI', 'MAZDA'];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
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
        <h4 className="font-medium text-gray-700 mb-3">Marca</h4>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todas las marcas</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Categorías</h4>
        <div>
          {categoriasData.categorias.map((categoria) => (
            <div key={categoria.nombre} className="mb-2">
              <button
                onClick={() => toggleCategory(categoria.nombre)}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  selectedCategory === categoria.nombre
                    ? 'bg-red-100 text-red-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{categoria.nombre}</span>
                  <span className="text-sm">
                    {expandedCategories.includes(categoria.nombre) ? '−' : '+'}
                  </span>
                </div>
              </button>

              {expandedCategories.includes(categoria.nombre) && (
                <div className="ml-4 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      onCategoryChange(categoria.nombre);
                      onSubcategoryChange('');
                    }}
                    className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                      selectedCategory === categoria.nombre && !selectedSubcategory
                        ? 'bg-red-50 text-red-600'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    Ver todo en {categoria.nombre}
                  </button>
                  {categoria.subcategorias.map((subcategoria) => (
                    <button
                      key={subcategoria}
                      onClick={() => {
                        onCategoryChange(categoria.nombre);
                        onSubcategoryChange(subcategoria);
                      }}
                      className={`w-full text-left p-2 text-sm rounded-md transition-colors ${
                        selectedCategory === categoria.nombre && selectedSubcategory === subcategoria
                          ? 'bg-red-50 text-red-600'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {subcategoria}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedYear || selectedBrand || selectedCategory) && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Filtros activos:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedYear && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                {selectedYear}
              </span>
            )}
            {selectedBrand && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                {selectedBrand}
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

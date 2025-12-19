/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid2X2, Grid3X3, Star, Plus, Minus } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Header from '../components/Header';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';
import useStore from '../states/global';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
    const [gridLayout, setGridLayout] = useState<'1' | '3' | '4'>('4');

    // Load saved grid layout from localStorage on component mount
    useEffect(() => {
        const savedLayout = localStorage.getItem('products-grid-layout');
        if (savedLayout && ['1', '3', '4'].includes(savedLayout)) {
            setGridLayout(savedLayout as '1' | '3' | '4');
        }
    }, []);

    // Save grid layout to localStorage when it changes
    const handleGridLayoutChange = (layout: '1' | '3' | '4') => {
        setGridLayout(layout);
        localStorage.setItem('products-grid-layout', layout);
    };

    // Filter states
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [filtersExpanded, setFiltersExpanded] = useState(false);

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Apply filters
        if (selectedYear) {
            // For demo purposes, we'll filter by year if it matches the product category or name
            // In a real app, products would have a year field
            filtered = filtered.filter(product =>
                product.category.includes(selectedYear) || product.name.includes(selectedYear)
            );
        }

        if (selectedBrand) {
            filtered = filtered.filter(product => product.category === selectedBrand);
        }

        if (selectedCategory) {
            // Map category names to product tags or categories
            const categoryMapping: { [key: string]: string[] } = {
                'Motor': ['Pistones', 'Anillos', 'Cigüeñal', 'Bielas'],
                'Transmisión y Embrague': ['Caja de cambios', 'Embrague'],
                'Suspensión y Dirección': ['Amortiguadores', 'Resortes'],
                'Frenos': ['Pastillas', 'Discos', 'Tambores'],
                'Sistema Eléctrico y Electrónico': ['Alternador', 'Batería', 'Motor de arranque'],
                'Sistema de Combustible': ['Bomba de gasolina', 'Inyectores', 'Filtros de combustible'],
                'Refrigeración y Calefacción': ['Radiador', 'Termostato', 'Bomba de agua'],
                'Escape': ['Múltiple de escape', 'Catalizador'],
                'Filtros': ['Filtro de aceite', 'Filtro de aire', 'Filtro de combustible'],
                'Carrocería y Accesorios Externos': ['Puertas', 'Capó', 'Parachoques', 'Faros'],
                'Interior y Confort': ['Asientos', 'Tablero', 'Aire acondicionado'],
                'Neumáticos y Ruedas': ['Llantas', 'Neumáticos', 'Rines'],
                'Lubricantes y Líquidos': ['Aceite de motor', 'Líquido de frenos']
            };

            const matchingTags = categoryMapping[selectedCategory] || [];
            filtered = filtered.filter(product =>
                matchingTags.some(tag => product.tag?.includes(tag) || product.name.includes(tag))
            );
        }

        if (selectedSubcategory) {
            filtered = filtered.filter(product =>
                product.tag?.includes(selectedSubcategory) || product.name.includes(selectedSubcategory)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'popular':
                filtered = [...filtered].sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                filtered = [...filtered].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered = [...filtered].sort((a, b) => b.price - a.price);
                break;
        }

        return filtered;
    }, [sortBy, selectedYear, selectedBrand, selectedCategory, selectedSubcategory]);

    const clearFilters = () => {
        setSelectedYear('');
        setSelectedBrand('');
        setSelectedCategory('');
        setSelectedSubcategory('');
    };

    const { addToCart, cart } = useStore();

    const handleAddToCart = (product: any) => {
        if (!cart.some(item => item.id === product.id)) {
            addToCart(product);
        }
    };

    const isInCart = (productId: number) => {
        return cart.some(item => item.id === productId);
    };

    const renderListItem = (product: any) => (
        <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md flex">
            <div onClick={() => navigate(`/producto/${product.id}`)} className="cursor-pointer relative w-48 h-48 flex-shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"

                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            </div>
            <div className="flex-1 p-6 relative">
                <p className="text-gray-500 text-sm mb-1">{product.category}</p>
                <h3 onClick={() => navigate(`/producto/${product.id}`)} className="cursor-pointer hover:underline font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < product.rating ? 'currentColor' : 'none'} />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm">{product.reviews} {product.reviews === 1 ? 'reseña' : 'reseñas'}</span>
                </div>

                {/* Price in top-right corner */}
                <p className="absolute top-6 right-6 text-red-500 font-bold text-xl">${product.price.toFixed(2)}</p>

                {/* Add to cart button in bottom-right corner */}
                <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id)}
                    className={`absolute bottom-6 right-6 px-4 py-2 rounded transition-colors ${isInCart(product.id)
                        ? 'bg-red-700 cursor-not-allowed opacity-75 text-white'
                        : 'bg-red-600 hover:bg-red-700 cursor-pointer text-white'
                        }`}
                >
                    {isInCart(product.id) ? 'Agregado' : 'Agregar al carrito'}
                </button>
            </div>
        </div>
    );

    const getGridClasses = () => {
        switch (gridLayout) {
            case '1':
                return 'grid-cols-1';
            case '3':
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
            case '4':
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        }
    };

    return (
        <>
            <Header />
            <CartModal />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">NUESTROS PRODUCTOS</h1>

                    {/* Filters Toggle Button - Only visible on mobile */}
                    <div className="mb-6 lg:hidden">
                        <button
                            onClick={() => setFiltersExpanded(!filtersExpanded)}
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <span className="font-medium text-gray-700">Filtros</span>
                            {filtersExpanded ? <Minus size={20} /> : <Plus size={20} />}
                        </button>
                    </div>

                    {/* Filters Section - Always visible on desktop, toggleable on mobile */}


                    {/* Main content */}
                    <div className="grid grid-cols-12 gap-4">
                        
                        <div className={'block md:hidden'}>
                            <div className={`${filtersExpanded ? 'block' : 'hidden'} lg:block w-full mb-8`}>
                                <ProductFilters
                                    selectedYear={selectedYear}
                                    selectedBrand={selectedBrand}
                                    selectedCategory={selectedCategory}
                                    selectedSubcategory={selectedSubcategory}
                                    onYearChange={setSelectedYear}
                                    onBrandChange={setSelectedBrand}
                                    onCategoryChange={setSelectedCategory}
                                    onSubcategoryChange={setSelectedSubcategory}
                                    onClearFilters={clearFilters}
                                />

                            </div>
                        </div>

                        <div className={'hidden md:block col-span-4'}>
                            <div className={`${filtersExpanded ? 'block' : 'hidden'} lg:block w-full mb-8`}>
                                <ProductFilters
                                    selectedYear={selectedYear}
                                    selectedBrand={selectedBrand}
                                    selectedCategory={selectedCategory}
                                    selectedSubcategory={selectedSubcategory}
                                    onYearChange={setSelectedYear}
                                    onBrandChange={setSelectedBrand}
                                    onCategoryChange={setSelectedCategory}
                                    onSubcategoryChange={setSelectedSubcategory}
                                    onClearFilters={clearFilters}
                                />

                            </div>
                        </div>
                        
                        {/* Sorting and Grid Controls */}
                        <div className="col-span-12 md:col-span-8">
                            <div className='flex items-center justify-between mb-6 p-4'>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high')}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="popular">Más popular</option>
                                        <option value="price-low">Precio menor</option>
                                        <option value="price-high">Precio mayor</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Vista:</span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleGridLayoutChange('1')}
                                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '1'
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <List size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleGridLayoutChange('3')}
                                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '3'
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Grid2X2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleGridLayoutChange('4')}
                                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '4'
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}>
                                            <Grid3X3 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Results count */}
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {gridLayout === '1' ? (
                                <div className="space-y-6">
                                    {filteredProducts.map(product => renderListItem(product))}
                                </div>
                            ) : (
                                <div className={`grid ${getGridClasses()} gap-8`}>
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductsPage;

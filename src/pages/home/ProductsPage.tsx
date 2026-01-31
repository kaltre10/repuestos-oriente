/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid2X2, Grid3X3, Star, Plus, Minus, Loader2, Trash2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { imagesUrl } from '../../utils/utils';
import ProductCard from '../../components/ProductCard';
import ProductFilters from '../../components/ProductFilters';
import CartModal from '../../components/CartModal';
import FormattedPrice from '../../components/FormattedPrice';
import useStore from '../../states/global';
import useNotify from '../../hooks/useNotify';
import { Dropdown, DropdownItem } from 'flowbite-react';

const ProductsPage = () => {
    const { notify } = useNotify();
    const navigate = useNavigate();
    const { products, loading, getProducts } = useProducts();
    const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
    const [gridLayout, setGridLayout] = useState<'1' | '3' | '4'>('4');

    // Load saved grid layout from localStorage on component mount
    useEffect(() => {
        document.title = "Repuestos Picha - Productos";
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
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [filtersExpanded, setFiltersExpanded] = useState(false);

    // Fetch products when year changes
    useEffect(() => {
        getProducts({ year: selectedYear });
    }, [selectedYear]);

    const filteredProducts = useMemo(() => {
        let filtered = products.map((p: any) => ({
            ...p,
            rating: p.rating || 0, // Default rating if not in DB
            reviews: p.reviews || 0, // Default reviews if not in DB
            image: p.images && p.images.length > 0
                ? `${imagesUrl}${p.images[0].image}`
                : '/placeholder-product.svg', // Default image if none
            category: p.categories // Map categories from DB to category for UI
        }));

        // Apply filters
        // No longer filtering by year here as it's done in the backend
        /* if (selectedYear) {
            filtered = filtered.filter(product =>
                product.years.includes(selectedYear) || product.name.includes(selectedYear)
            );
        } */

        if (selectedBrand) {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }

        if (selectedModel) {
            filtered = filtered.filter(product => product.model === selectedModel);
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => product.categories.includes(selectedCategory));
        }

        if (selectedSubcategory) {
            filtered = filtered.filter(product =>
                product.subcategories?.includes(selectedSubcategory) || 
                product.name.toLowerCase().includes(selectedSubcategory.toLowerCase())
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'popular':
                filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'price-low':
                filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'price-high':
                filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
                break;
        }

        return filtered;
    }, [products, sortBy, selectedYear, selectedBrand, selectedModel, selectedCategory, selectedSubcategory]);

    const clearFilters = () => {
        setSelectedYear('');
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedCategory('');
        setSelectedSubcategory('');
    };

    const { addToCart, cart, incrementQuantity, decrementQuantity, removeFromCart } = useStore();

    const handleAddToCart = (product: any) => {
        if (!cart.some(item => item.id === product.id)) {
            const discountPercent = product.discount ? Number(product.discount) : 0;
            const basePrice = Number(product.price);
            const discountedPrice = discountPercent > 0 ? basePrice * (1 - (discountPercent / 100)) : basePrice;
            addToCart({ ...product, price: discountedPrice });
            notify.success(`${product.name} agregado al carrito`);
        }
    };

    const getCartItem = (productId: number) => {
        return cart.find(item => item.id === productId);
    };

    const renderListItem = (product: any) => {
        const cartItem = getCartItem(product.id);
        const isInCart = !!cartItem;
        const basePrice = Number(product.price);
        const discountPercent = product.discount ? Number(product.discount) : 0;
        const discountedPrice = discountPercent > 0 ? basePrice * (1 - (discountPercent / 100)) : basePrice;

        return (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col sm:flex-row">
                <div onClick={() => navigate(`/producto/${product.id}`)} className="cursor-pointer relative w-full sm:w-40 h-40 sm:h-48 flex-shrink-0">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <div className="flex-1 p-4 sm:p-6 relative">
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">{product.category}</p>
                    <h3 onClick={() => navigate(`/producto/${product.id}`)} className="cursor-pointer hover:underline font-semibold text-base sm:text-lg mb-2 text-gray-800 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                               <div key={i} className="size-3.5 sm:size-4 text-yellow-400">
                                    <Star 
                                        fill={i < product.rating ? 'currentColor' : 'none'} 
                                        className="size-full"
                                    />
                                </div>                  
                            ))}
                        </div>
                        <span className="text-gray-500 text-xs sm:text-sm">{product.reviews} {product.reviews === 1 ? 'reseña' : 'reseñas'}</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4 sm:mb-0">
                        {discountPercent > 0 ? (
                            <>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                                        <FormattedPrice price={basePrice} />
                                    </span>
                                    <span className="text-red-600 text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                        {discountPercent}% OFF
                                    </span>
                                </div>
                                <FormattedPrice price={discountedPrice} className="text-red-500 font-bold text-xl sm:text-2xl" />
                            </>
                        ) : (
                            <FormattedPrice price={basePrice} className="text-red-500 font-bold text-lg sm:text-xl" />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4">
                        {isInCart ? (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => decrementQuantity(product.id)}
                                        className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 disabled:opacity-50"
                                        disabled={cartItem.quantity <= 1}
                                    >
                                        <div className="inline-block size-4 sm:size-[18px]">
                                            <Minus className="size-full" />
                                        </div>
                                    </button>
                                    <span className="px-2 sm:px-3 font-bold text-xs sm:text-sm">
                                        {cartItem.quantity}
                                    </span>
                                   <button
                                        onClick={() => incrementQuantity(product.id)}
                                        className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                                    >
                                        <Plus className="size-4 sm:size-[18px]" />
                                    </button>
                                </div>
                                <button
                                onClick={() => removeFromCart(product.id)}
                                className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Eliminar del carrito"
                                >
                                    <div className="size-4 sm:size-[18px]">
                                        <Trash2 className="size-full" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-colors cursor-pointer text-sm"
                            >
                                Agregar al carrito
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getGridClasses = () => {
        switch (gridLayout) {
            case '1':
                return 'grid-cols-1 gap-1';
            case '3':
                return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1';
            case '4':
                return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2';
            default:
                return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Cargando productos...</p>
            </div>
        );
    }

    return (
        <>
            <CartModal />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 sm:px-1 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">NUESTROS PRODUCTOS</h1>

                    {/* Filters Toggle Button - Only visible on mobile */}
                    <div className="mb-6 md:hidden">
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
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:flex">

                        {/* Filters Section */}
                        {/* Mobile filters - toggleable */}
                        <div className="md:hidden">
                            <div className={`${filtersExpanded ? 'block' : 'hidden'} w-full`}>
                                <ProductFilters
                                    selectedYear={selectedYear}
                                    selectedBrand={selectedBrand}
                                    selectedModel={selectedModel}
                                    selectedCategory={selectedCategory}
                                    selectedSubcategory={selectedSubcategory}
                                    onYearChange={setSelectedYear}
                                    onBrandChange={setSelectedBrand}
                                    onModelChange={setSelectedModel}
                                    onCategoryChange={setSelectedCategory}
                                    onSubcategoryChange={setSelectedSubcategory}
                                    onClearFilters={clearFilters}
                                />
                            </div>
                        </div>

                        {/* Desktop filters - always visible */}
                        <div className="hidden md:block md:col-span-3 lg:col-span-3">
                            <ProductFilters
                                selectedYear={selectedYear}
                                selectedBrand={selectedBrand}
                                selectedModel={selectedModel}
                                selectedCategory={selectedCategory}
                                selectedSubcategory={selectedSubcategory}
                                onYearChange={setSelectedYear}
                                onBrandChange={setSelectedBrand}
                                onModelChange={setSelectedModel}
                                onCategoryChange={setSelectedCategory}
                                onSubcategoryChange={setSelectedSubcategory}
                                onClearFilters={clearFilters}
                            />
                        </div>

                        {/* Sorting and Grid Controls */}
                        <div className="col-span-12 md:col-span-9 lg:col-span-9 md:w-full">
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm gap-4'>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                                    <Dropdown className='px-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none'
                                        label={
                                            sortBy === 'popular' ? 'Más popular' :
                                                sortBy === 'price-low' ? 'Precio menor' : 'Precio mayor'
                                        }
                                        size="sm"
                                        color="light" // Esto imita el borde gris de tu original
                                        dismissOnClick={true}
                                    >
                                        <DropdownItem onClick={() => setSortBy('popular')}>
                                            Más popular
                                        </DropdownItem>
                                        <DropdownItem onClick={() => setSortBy('price-low')}>
                                            Precio menor
                                        </DropdownItem>
                                        <DropdownItem onClick={() => setSortBy('price-high')}>
                                            Precio mayor
                                        </DropdownItem>
                                    </Dropdown>
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
                                <div className={`grid ${getGridClasses()}`}>
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
        </>
    );
};

export default ProductsPage;

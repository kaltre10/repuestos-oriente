/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, Grid2X2, Grid3X3, Star, Plus, Minus, Loader2, Trash2, Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
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
    const location = useLocation();
    
    // Obtener búsqueda de la URL
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const searchParam = queryParams.get('search') || '';

    // Función para limpiar la búsqueda de la URL
    const clearSearchParam = useCallback(() => {
        if (queryParams.has('search')) {
            queryParams.delete('search');
            const newSearch = queryParams.toString();
            navigate({
                pathname: location.pathname,
                search: newSearch ? `?${newSearch}` : ''
            }, { replace: true });
        }
    }, [location.pathname, queryParams, navigate]);

    const { products, loading, getProducts } = useProducts();
    const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
    const [gridLayout, setGridLayout] = useState<'1' | '2' | '4'>('4');

    // Filter states
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [filtersExpanded, setFiltersExpanded] = useState(false);

    // Fetch products when filters, sort or search changes
    useEffect(() => {
        getProducts({ year: selectedYear, page: 1, limit: 20, sortBy, search: searchParam });
    }, [selectedYear, sortBy, searchParam]);

    const loadMoreProducts = useCallback(async (nextPage: number) => {
        const result = await getProducts({ year: selectedYear, page: nextPage, limit: 20, sortBy, search: searchParam });
        return result.pagination.hasMore;
    }, [getProducts, selectedYear, sortBy, searchParam]);

    const { hasMore, isLoading, loadMoreRef, reset } = useInfiniteScroll({
        loadMore: loadMoreProducts,
        initialPage: 1
    });

    // Reset scroll when filters or search change
    useEffect(() => {
        reset();
    }, [selectedYear, sortBy, searchParam, reset]);

    // Load saved grid layout from localStorage on component mount
    useEffect(() => {
        document.title = "Repuestos Picha - Productos";
        const savedLayout = localStorage.getItem('products-grid-layout');
        if (savedLayout && ['1', '2', '4'].includes(savedLayout)) {
            setGridLayout(savedLayout as '1' | '2' | '4');
        }
    }, []);

    // Save grid layout to localStorage when it changes
    const handleGridLayoutChange = (layout: '1' | '2' | '4') => {
        setGridLayout(layout);
        localStorage.setItem('products-grid-layout', layout);
    };

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

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        clearSearchParam();
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        clearSearchParam();
    };

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        clearSearchParam();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        clearSearchParam();
    };

    const handleSubcategoryChange = (subcategory: string) => {
        setSelectedSubcategory(subcategory);
        clearSearchParam();
    };

    const clearFilters = () => {
        setSelectedYear('');
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedCategory('');
        setSelectedSubcategory('');
        clearSearchParam();
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
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row border border-gray-100 group hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div onClick={() => navigate(`/producto/${product.id}`)} className="cursor-pointer relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                        src={product.image || '/placeholder-product.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold">{product.category}</p>
                    </div>
                    <h3 onClick={() => navigate(`/producto/${product.id}`)} className="cursor-pointer hover:text-red-600 transition-colors font-bold text-base sm:text-lg mb-2 text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                    
                    <div className="flex items-center mb-4">
                        <div className="flex mr-2 scale-90 origin-left">
                            {[...Array(5)].map((_, i) => (
                               <div key={i} className="size-3.5 text-yellow-400">
                                    <Star 
                                        fill={i < product.rating ? 'currentColor' : 'none'} 
                                        className="size-full"
                                    />
                                </div>                  
                            ))}
                        </div>
                        <span className="text-gray-400 text-xs">({product.reviews})</span>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            {discountPercent > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs text-gray-400 line-through">
                                            <FormattedPrice price={basePrice} />
                                        </span>
                                        <span className="text-white text-[10px] font-black bg-red-600 px-1.5 py-0.5 rounded-sm">
                                            -{discountPercent}%
                                        </span>
                                    </div>
                                    <FormattedPrice price={discountedPrice} className="text-red-600 font-black text-2xl" />
                                </>
                            ) : (
                                <FormattedPrice price={basePrice} className="text-red-600 font-black text-xl" />
                            )}
                        </div>

                        <div className="w-full sm:w-auto">
                            {isInCart ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5 sm:p-1 flex-1 sm:flex-none justify-between">
                                        <button
                                            onClick={() => decrementQuantity(product.id)}
                                            className="flex-1 sm:flex-none flex justify-center p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 active:scale-90"
                                            disabled={cartItem.quantity <= 1}
                                            title="Disminuir cantidad"
                                        >
                                            <Minus className="size-3.5 sm:size-4" />
                                        </button>
                                        <span className="px-2 sm:px-4 font-black text-xs sm:text-sm text-gray-700 min-w-[1.5rem] sm:min-w-[3rem] text-center">
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            onClick={() => incrementQuantity(product.id)}
                                            className="flex-1 sm:flex-none flex justify-center p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 active:scale-90"
                                            title="Aumentar cantidad"
                                        >
                                            <Plus className="size-3.5 sm:size-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="p-2 sm:p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors active:scale-90 shadow-sm border border-red-100"
                                        title="Eliminar del carrito"
                                    >
                                        <Trash2 className="size-4 sm:size-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 rounded-lg transition-all active:scale-95 text-xs uppercase tracking-widest shadow-sm"
                                >
                                    Comprar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getGridClasses = () => {
        switch (gridLayout) {
            case '1': return 'flex flex-col gap-6';
            case '2': return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
            case '4': return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
            default: return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center animate-fade-in">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-red-100 rounded-full"></div>
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Explorando nuestro inventario...</p>
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
                                    onYearChange={handleYearChange}
                                    onBrandChange={handleBrandChange}
                                    onModelChange={handleModelChange}
                                    onCategoryChange={handleCategoryChange}
                                    onSubcategoryChange={handleSubcategoryChange}
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
                                onYearChange={handleYearChange}
                                onBrandChange={handleBrandChange}
                                onModelChange={handleModelChange}
                                onCategoryChange={handleCategoryChange}
                                onSubcategoryChange={handleSubcategoryChange}
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
                                            onClick={() => handleGridLayoutChange('2')}
                                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '2'
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Grid2X2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleGridLayoutChange('4')}
                                            className={`hidden md:flex px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '4'
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

                            <div 
                                key={gridLayout}
                                className={`${gridLayout === '1' ? 'space-y-6' : `grid ${getGridClasses()}`} animate-fade-in`}
                            >
                                {filteredProducts.map((product: any, index: number) => (
                                    <div 
                                        key={product.id} 
                                        className="animate-slide-up"
                                        style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, animationFillMode: 'both' }}
                                    >
                                        {gridLayout === '1' ? (
                                            renderListItem(product)
                                        ) : (
                                            <ProductCard product={product} compact={gridLayout === '4'} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Active search indicator */}
                            {searchParam && (
                                <div className="mb-6 flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <Search className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Resultados para: <span className="text-red-600 italic">"{searchParam}"</span></p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{filteredProducts.length} productos encontrados</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/productos')}
                                        className="text-xs font-black text-red-600 hover:text-red-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-red-100 transition-all active:scale-95 uppercase"
                                    >
                                        Limpiar búsqueda
                                    </button>
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

                            {/* Infinite Scroll Loader */}
                            {hasMore && (
                                <div ref={loadMoreRef} className="flex justify-center py-12">
                                    {isLoading && (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                                            <p className="text-sm text-gray-500">Cargando más productos...</p>
                                        </div>
                                    )}
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

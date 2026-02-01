/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid2X2, Grid3X3, Loader2, Plus, Minus, Trash2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { imagesUrl } from '../utils/utils';
import ProductCard from './ProductCard';
import Rating from './Rating';
import useStore from '../states/global';
import FormattedPrice from './FormattedPrice';
import useNotify from '../hooks/useNotify';

const BestSellers = () => {
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { products, loading, getProducts } = useProducts();
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
  const [gridLayout, setGridLayout] = useState<'1' | '2' | '4'>('4');

  // Carga inicial de productos
  useEffect(() => {
    getProducts({ page: 1, limit: 20, sortBy });
  }, [sortBy]);

  const loadMoreProducts = useCallback(async (nextPage: number) => {
    const result = await getProducts({ page: nextPage, limit: 20, sortBy });
    return result.pagination.hasMore;
  }, [getProducts, sortBy]);

  const { hasMore, loadMoreRef, reset } = useInfiniteScroll({
    loadMore: loadMoreProducts,
    initialPage: 1
  });

  // Reiniciar scroll cuando cambia el ordenamiento
  useEffect(() => {
    reset();
  }, [sortBy, reset]);

  // Load saved grid layout from localStorage on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('bestsellers-grid-layout');
    if (savedLayout && ['1', '2', '4'].includes(savedLayout)) {
      setGridLayout(savedLayout as '1' | '2' | '4');
    }
  }, []);

  // Save grid layout to localStorage when it changes
  const handleGridLayoutChange = (layout: '1' | '2' | '4') => {
    setGridLayout(layout);
    localStorage.setItem('bestsellers-grid-layout', layout);
  };

  const processedProducts = useMemo(() => {
    return products.map((p: any) => ({
      ...p,
      image: p.images && p.images.length > 0 
        ? `${imagesUrl}${p.images[0].image}` 
        : '/placeholder-product.svg',
      category: p.categories
    }));
  }, [products]);

  const getGridClasses = () => {
    switch (gridLayout) {
      case '1': return 'flex flex-col gap-6';
      case '2': return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
      case '4': return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
      default: return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
    }
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
        <div className="relative cursor-pointer w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden" onClick={() => navigate(`/producto/${product.id}`)}>
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
            <Rating hover={false} action={() => { }} stars={Math.round(product.rating)} />
            <span className="text-gray-400 text-xs ml-2">({product.reviews})</span>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {discountPercent > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-gray-400 line-through">
                      <FormattedPrice price={basePrice} />
                    </span>
                    <span className="text-white text-[10px] font-black bg-red-600 px-1.5 py-0.5 rounded-sm animate-pulse">
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
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5 sm:p-1 flex-1 sm:flex-none justify-between shadow-inner">
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
                    className="p-2 sm:p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-sm border border-red-100"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="size-4 sm:size-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 rounded-lg transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg hover:shadow-red-200"
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

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center animate-fade-in">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-red-100 rounded-full"></div>
        </div>
        <p className="text-gray-400 font-medium animate-pulse">Descubriendo lo mejor para ti...</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-3">MÁS VENDIDOS</h2>
          <div className="w-20 h-1 bg-red-500 rounded-full"></div>
        </div>

        {/* Sorting and Grid Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 p-4 bg-gray-50 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white shadow-sm"
            >
              <option value="popular">Más popular</option>
              <option value="price-low">Precio menor</option>
              <option value="price-high">Precio mayor</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Vista:</span>
            <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => handleGridLayoutChange('1')}
                className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${gridLayout === '1'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => handleGridLayoutChange('2')}
                className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${gridLayout === '2'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => handleGridLayoutChange('4')}
                className={`hidden md:flex cursor-pointer px-3 py-2 rounded-md text-sm transition-all duration-200 ${gridLayout === '4'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div 
          key={gridLayout}
          className={`${getGridClasses()} animate-zoom-in`}
        >
          {processedProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, fillMode: 'both' }}
            >
              {gridLayout === '1' ? (
                renderListItem(product)
              ) : (
                <ProductCard product={product} compact={gridLayout === '4'} />
              )}
            </div>
          ))}
        </div>

        {/* Elemento observador para scroll infinito */}
        <div ref={loadMoreRef} className="py-10 flex justify-center">
          {hasMore && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Cargando más productos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;

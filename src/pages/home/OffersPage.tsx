import { useState, useMemo, useEffect, useCallback } from 'react';
import { List, Grid2X2, Grid3X3, Tag, Loader2, Star, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import CartModal from '../../components/CartModal';
import FormattedPrice from '../../components/FormattedPrice';
import { useProducts } from '../../hooks/useProducts';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { imagesUrl } from '../../utils/utils';
import useStore from '../../states/global';
import useNotify from '../../hooks/useNotify';
import SEO from '../../components/SEO';

const OffersPage = () => {
  const { products, loading, getProducts } = useProducts();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { addToCart, cart, incrementQuantity, decrementQuantity, removeFromCart } = useStore();
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount'>('discount');
  const [gridLayout, setGridLayout] = useState<'1' | '2' | '4'>('4');

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
                  disabled={Number(product.amount) <= 0}
                  className={`w-full sm:w-auto font-black px-8 py-3 rounded-lg transition-all active:scale-95 text-xs uppercase tracking-widest shadow-sm ${
                    Number(product.amount) <= 0 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {Number(product.amount) <= 0 ? 'Sin Stock' : 'Comprar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Carga inicial
  useEffect(() => {
    getProducts({ onSale: true, page: 1, limit: 20, sortBy });
  }, [sortBy]);

  const loadMoreProducts = useCallback(async (nextPage: number) => {
    const result = await getProducts({ onSale: true, page: nextPage, limit: 20, sortBy });
    return result.pagination.hasMore;
  }, [getProducts, sortBy]);

  const { hasMore, isLoading, loadMoreRef, reset } = useInfiniteScroll({
    loadMore: loadMoreProducts,
    initialPage: 1
  });

  // Reiniciar scroll cuando cambia el ordenamiento
  useEffect(() => {
    reset();
  }, [sortBy, reset]);

  useEffect(() => {
    const savedLayout = localStorage.getItem('offers-grid-layout');
    if (savedLayout && ['1', '2', '4'].includes(savedLayout)) {
      setGridLayout(savedLayout as '1' | '2' | '4');
    }
  }, []);

  const handleGridLayoutChange = (layout: '1' | '2' | '4') => {
    setGridLayout(layout);
    localStorage.setItem('offers-grid-layout', layout);
  };

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    let filtered = products
      .filter((p: any) => (p.discount || 0) > 0)
      .map((p: any) => ({
        ...p,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        image: p.images && p.images.length > 0
          ? `${imagesUrl}${p.images[0].image}`
          : '/placeholder-product.svg',
        category: p.categories
      }));

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
      case 'discount':
        filtered = [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    return filtered;
  }, [products, sortBy]);

  const getGridClasses = () => {
    switch (gridLayout) {
      case '1': return 'flex flex-col gap-6';
      case '2': return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
      case '4': return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
      default: return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
    }
  };

  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    "name": "Ofertas de Repuestos en Repuestos Picha",
    "description": "Descuentos increíbles en repuestos para todas las marcas de autos en Venezuela.",
    "url": window.location.href,
    "category": "Auto Parts"
  };

  return (
    <>
      <SEO 
        title="Ofertas" 
        description="Aprovecha las mejores ofertas en repuestos de autos en Venezuela. Descuentos en frenos, suspensión, motor y más."
        structuredData={offersSchema}
      />
      <CartModal />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with offer banner */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Tag size={32} />
              <h1 className="text-4xl font-bold">¡OFERTAS ESPECIALES!</h1>
              <Tag size={32} />
            </div>
            <p className="text-lg opacity-90">Descuentos exclusivos en productos seleccionados</p>
          </div>

          {/* Sorting and Grid Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high' | 'discount')}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="discount">Mayor descuento</option>
                <option value="popular">Más popular</option>
                <option value="price-low">Precio menor</option>
                <option value="price-high">Precio mayor</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Vista:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setGridLayout('1')}
                  className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                    gridLayout === '1'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setGridLayout('2')}
                  className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                    gridLayout === '2'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  onClick={() => setGridLayout('4')}
                  className={`hidden md:flex px-3 py-1 border rounded-md text-sm transition-colors ${
                    gridLayout === '4'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center animate-fade-in py-12">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-red-100 rounded-full"></div>
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Buscando las mejores ofertas...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div 
                key={gridLayout}
                className={`${gridLayout === '1' ? 'space-y-6 w-full' : `grid ${getGridClasses()} gap-8 w-full`} animate-zoom-in`}
              >
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, animationFillMode: 'both' } as any}
                  >
                    {gridLayout === '1' ? (
                      renderListItem(product)
                    ) : (
                      <div className="relative">
                        {/* Discount badge */}
                        {product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-md">
                            -{product.discount}%
                          </div>
                        )}
                        <ProductCard product={product as any} compact={gridLayout === '4'} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No hay ofertas disponibles</h3>
                <p className="text-gray-500">Vuelve pronto para descubrir nuevos descuentos.</p>
              </div>
            )}
          </div>

          {/* Infinite Scroll Loader */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-12">
              {isLoading && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  <p className="text-sm text-gray-500">Cargando más ofertas...</p>
                </div>
              )}
            </div>
          )}

          {/* Call to action */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¿No encuentras lo que buscas?</h3>
              <p className="text-gray-600 mb-4">Contáctanos para ofertas personalizadas</p>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffersPage;

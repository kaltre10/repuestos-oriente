import { useState, useMemo, useEffect, useCallback } from 'react';
import { List, Grid2X2, Grid3X3, Tag, Loader2 } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import CartModal from '../../components/CartModal';
import { useProducts } from '../../hooks/useProducts';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { imagesUrl } from '../../utils/utils';

const OffersPage = () => {
  const { products, loading, getProducts } = useProducts();
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'discount'>('discount');
  const [gridLayout, setGridLayout] = useState<'1' | '3' | '4'>('4');

  // Carga inicial
  useEffect(() => {
    document.title = "Repuestos Picha - Ofertas";
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
                  onClick={() => setGridLayout('3')}
                  className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                    gridLayout === '3'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  onClick={() => setGridLayout('4')}
                  className={`px-3 py-1 border rounded-md text-sm transition-colors ${
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
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
                <p className="text-gray-600 font-medium">Cargando ofertas...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid ${getGridClasses()} gap-8 w-full`}>
                {filteredProducts.map(product => (
                  <div key={product.id} className="relative">
                    {/* Discount badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                        -{product.discount}%
                      </div>
                    )}
                    <ProductCard product={product as any} />
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

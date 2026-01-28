/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Grid2X2, Grid3X3, Star, Loader2, Plus, Minus, Trash2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { imagesUrl } from '../utils/utils';
import ProductCard from './ProductCard';
import useStore from '../states/global';
import FormattedPrice from './FormattedPrice';

const BestSellers = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
  const [gridLayout, setGridLayout] = useState<'1' | '3' | '4'>('4');

  // Load saved grid layout from localStorage on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('bestsellers-grid-layout');
    if (savedLayout && ['1', '3', '4'].includes(savedLayout)) {
      setGridLayout(savedLayout as '1' | '3' | '4');
    }
  }, []);

  // Save grid layout to localStorage when it changes
  const handleGridLayoutChange = (layout: '1' | '3' | '4') => {
    setGridLayout(layout);
    localStorage.setItem('bestsellers-grid-layout', layout);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.map((p: any) => ({
      ...p,
      rating: p.rating || 5,
      reviews: p.reviews || 0,
      image: p.images && p.images.length > 0 
        ? `${imagesUrl}${p.images[0].image}` 
        : '/placeholder-product.png',
      category: p.categories
    }));

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

  const { addToCart, cart, incrementQuantity, decrementQuantity, removeFromCart } = useStore();

  const handleAddToCart = (product: any) => {
    if (!cart.some(item => item.id === product.id)) {
      const discountPercent = product.discount ? Number(product.discount) : 0;
      const basePrice = Number(product.price);
      const discountedPrice = discountPercent > 0 ? basePrice * (1 - (discountPercent / 100)) : basePrice;
      addToCart({ ...product, price: discountedPrice });
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
      <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md flex">
        <div className="relative cursor-pointer w-48 h-48" onClick={() => navigate(`/producto/${product.id}`)}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full  h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        </div>
        <div className="flex-1 p-6 relative">
          <p className="text-gray-500 text-sm mb-1">{product.category}</p>
          <h3 onClick={() => navigate(`/producto/${product.id}`)} className="hover:underline cursor-pointer font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < product.rating ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">({product.reviews} reseñas)</span>
          </div>
          <div className="flex flex-col mb-4">
            {discountPercent > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    <FormattedPrice price={basePrice} />
                  </span>
                  <span className="text-red-600 text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                </div>
                <FormattedPrice price={discountedPrice} className="text-red-500 font-bold text-2xl" />
              </>
            ) : (
              <FormattedPrice price={basePrice} className="text-red-500 font-bold text-xl" />
            )}
          </div>

          {/* Actions in bottom-right corner */}
          <div className="absolute bottom-6 right-6">
            {isInCart ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => decrementQuantity(product.id)}
                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 disabled:opacity-50"
                    disabled={cartItem.quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-3 font-bold text-sm">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(product.id)}
                    className="p-1 hover:bg-white rounded-md transition-colors text-gray-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Eliminar del carrito"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Agregar al carrito
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-2" />
        <p className="text-gray-500">Cargando productos destacados...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">MÁS VENDIDOS</h2>

        {/* Sorting and Grid Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high')}
              className="px-3 cursor-pointer py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className={`cursor-pointer px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '1'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => handleGridLayoutChange('3')}
                className={`cursor-pointer px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '3'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                onClick={() => handleGridLayoutChange('4')}
                className={`cursor-pointer px-3 py-1 border rounded-md text-sm transition-colors ${gridLayout === '4'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Grid3X3 size={16} />
              </button>
            </div>
          </div>
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
      </div>
    </div>
  );
};

export default BestSellers;

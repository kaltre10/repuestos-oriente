import { useState, useMemo } from 'react';
import { List, Grid2X2, Grid3X3, X, Star } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import useStore from '../states/global';

const BestSellers = () => {
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
  const [gridLayout, setGridLayout] = useState<'1' | '3' | '4'>('4');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

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
  }, [sortBy]);

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

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
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
      <div className="relative w-48 h-48 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openImageModal(product.image)}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
      </div>
      <div className="flex-1 p-6 relative">
        <p className="text-gray-500 text-sm mb-1">{product.category}</p>
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
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
          className={`absolute bottom-6 right-6 px-4 py-2 rounded transition-colors ${
            isInCart(product.id)
              ? 'bg-red-700 cursor-not-allowed opacity-75 text-white'
              : 'bg-red-600 hover:bg-red-700 cursor-pointer text-white'
          }`}
        >
          {isInCart(product.id) ? 'Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 py-16 mt-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">MÁS VENDIDOS</h2>

        {/* Sorting and Grid Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
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

        {gridLayout === '1' ? (
          <div className="space-y-6">
            {filteredProducts.map(product => renderListItem(product))}
          </div>
        ) : (
          <div className={`grid ${getGridClasses()} gap-8`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onImageClick={openImageModal} />
            ))}
          </div>
        )}

        {/* Image Modal */}
        {isModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={selectedImage}
                alt="Product"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-colors"
              >
                <X size={24} className="text-gray-800" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;

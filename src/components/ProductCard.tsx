import { Star, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../states/global';
import FormattedPrice from './FormattedPrice';

interface ProductCardProps {
  product: {
    id: number;
    category: string;
    name: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    years: string;
  };
  onImageClick?: (imageSrc: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, cart, incrementQuantity, decrementQuantity, removeFromCart } = useStore();

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(product);
    }
  };

  const handleImageClick = () => {
    navigate(`/producto/${product.id}`);
  };

  return (
    <div className="bg-white text-gray-800 rounded-lg overflow-hidden group shadow-md flex flex-col h-full">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover cursor-pointer"
        />
        <div onClick={handleImageClick} className="cursor-pointer absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 onClick={handleImageClick} className="hover:underline cursor-pointer font-semibold mt-1 truncate text-gray-800">{product.name}</h3>
        <div className='flex justify-between items-center'>
          <p className="text-gray-500 text-sm">{product.category}</p>
          <p className='text-gray-500 text-sm'>{product.years} </p>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < product.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">{product.reviews} {product.reviews === 1 ? 'reseña' : 'reseñas'}</span>
        </div>
        <div className="mt-2 mb-4">
          <FormattedPrice price={product.price} className="text-red-500 font-bold text-lg" />
        </div>

        <div className="mt-auto">
          {isInCart ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-1">
                <button
                  onClick={() => decrementQuantity(product.id)}
                  className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 disabled:opacity-50"
                  disabled={cartItem.quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="flex-1 text-center font-bold text-sm">
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
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

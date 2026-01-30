import { Star, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';
import useStore from '../states/global';
import FormattedPrice from './FormattedPrice';
import { imagesUrl } from '../utils/utils';
import useNotify from '../hooks/useNotify';

interface ProductCardProps {
  product: {
    id: number;
    category: string;
    name: string;
    rating: number;
    reviews: number;
    price: number;
    discount?: number;
    image: string;
    years?: string;
    images?: { image: string }[];
  };
  onImageClick?: (imageSrc: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { addToCart, cart, incrementQuantity, decrementQuantity, removeFromCart } = useStore();

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const displayImage = product.images && product.images.length > 0
    ? `${imagesUrl}${product.images[0].image}`
    : (product.image?.startsWith('http') ? product.image : '/placeholder-product.png');

  const basePrice = Number(product.price);
  const discountPercent = product.discount ? Number(product.discount) : 0;
  const discountedPrice = discountPercent > 0 ? basePrice * (1 - (discountPercent / 100)) : basePrice;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({ ...product, image: displayImage, price: discountedPrice });
      notify.success(`${product.name} agregado al carrito`);
    }
  };

  const handleImageClick = () => {
    navigate(`/producto/${product.id}`);
  };

  return (
    <div className="bg-white text-gray-800 rounded-lg overflow-hidden group shadow-md flex flex-col h-full">
      <div className="relative">
        <img
          src={displayImage}
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
        <div className="flex items-center gap-2 mt-2">
          <Rating hover={false} action={() => { }} stars={Math.round(product.rating)} />
          <span className="text-gray-500 text-sm">{product.reviews} {product.reviews === 1 ? 'reseña' : 'reseñas'}</span>
        </div>
        <div className="mt-2 mb-4 flex flex-col">
          {discountPercent > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm line-through">
                  <FormattedPrice price={basePrice} />
                </span>
                <span className="text-red-600 text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </div>
              <FormattedPrice price={discountedPrice} className="text-red-600 font-bold text-xl leading-tight" />
            </>
          ) : (
            <FormattedPrice price={basePrice} className="text-red-500 font-bold text-lg" />
          )}
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

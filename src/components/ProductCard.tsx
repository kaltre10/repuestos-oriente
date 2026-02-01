import { Plus, Minus, Trash2 } from 'lucide-react';
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
    brand?: { name: string };
    model?: { name: string };
    stock?: number;
  };
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { addToCart, cart, incrementQuantity, decrementQuantity, removeFromCart } = useStore();

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const displayImage = product.images && product.images.length > 0
    ? `${imagesUrl}${product.images[0].image}`
    : (product.image?.startsWith('http') ? product.image : '/placeholder-product.svg');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder-product.svg';
  };

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
    <div className="bg-white text-gray-800 rounded-lg overflow-hidden group shadow-md flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="relative aspect-square sm:aspect-auto sm:h-56">
        <img
          src={displayImage}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover cursor-pointer"
        />
        <div onClick={handleImageClick} className="cursor-pointer absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 onClick={handleImageClick} className="hover:underline cursor-pointer font-bold text-sm sm:text-base mt-1 line-clamp-2 text-gray-800 min-h-[2.5rem] sm:min-h-0">{product.name}</h3>
        <div className='flex justify-between items-center mt-1'>
          <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-semibold">{product.category}</p>
          {product.years && <p className='text-gray-500 text-[10px] sm:text-xs font-medium'>{product.years} </p>}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="scale-75 sm:scale-100 origin-left">
            <Rating hover={false} action={() => { }} stars={Math.round(product.rating)} />
          </div>
          <span className="text-gray-400 text-[10px] sm:text-xs">({product.reviews})</span>
        </div>
        <div className="mt-3 mb-4 flex flex-col justify-end flex-1">
          {discountPercent > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs line-through decoration-red-400/50">
                  <FormattedPrice price={basePrice} />
                </span>
                <span className="text-white text-[10px] font-black bg-red-600 px-1.5 py-0.5 rounded-sm">
                  -{discountPercent}%
                </span>
              </div>
              <FormattedPrice price={discountedPrice} className="text-red-600 font-black text-lg sm:text-xl leading-tight" />
            </>
          ) : (
            <FormattedPrice price={basePrice} className="text-red-600 font-black text-base sm:text-lg" />
          )}
        </div>

        <div className="mt-auto">
          {isInCart ? (
            <div className={`flex items-center ${compact ? 'gap-1' : 'gap-1 sm:gap-2'}`}>
              <div className={`flex items-center bg-gray-50 border border-gray-100 rounded-lg ${compact ? 'p-0.5' : 'p-0.5 sm:p-1'} flex-1 justify-between`}>
                <button
                  onClick={() => decrementQuantity(product.id)}
                  className={`flex-1 flex justify-center ${compact ? 'p-1' : 'p-1.5 sm:p-2'} hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 active:scale-90`}
                  disabled={cartItem.quantity <= 1}
                  title="Disminuir cantidad"
                >
                  <Minus className={`${compact ? 'size-3' : 'size-3.5 sm:size-4'}`} />
                </button>
                <span className={`${compact ? 'px-1 min-w-[1.2rem] text-[10px]' : 'px-1 sm:px-4 min-w-[1.5rem] sm:min-w-[3rem] text-xs sm:text-sm'} font-black text-gray-700 text-center`}>
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => incrementQuantity(product.id)}
                  className={`flex-1 flex justify-center ${compact ? 'p-1' : 'p-1.5 sm:p-2'} hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 active:scale-90`}
                  title="Aumentar cantidad"
                >
                  <Plus className={`${compact ? 'size-3' : 'size-3.5 sm:size-4'}`} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className={`${compact ? 'p-1.5' : 'p-2 sm:p-2.5'} bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors active:scale-90 shadow-sm border border-red-100`}
                title="Eliminar del carrito"
              >
                <Trash2 className={`${compact ? 'size-3.5' : 'size-4 sm:size-5'}`} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2 sm:py-2.5 rounded-lg transition-all active:scale-95 text-[11px] sm:text-xs uppercase tracking-widest shadow-sm hover:shadow-md"
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

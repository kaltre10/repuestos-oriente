import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Loader2, MessageSquare, Send, Plus, Minus, Trash2, Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { imagesUrl, apiUrl } from '../../utils/utils';
import request from '../../utils/request';
import CartModal from '../../components/CartModal';
import ImageGallery from '../../components/ImageGallery';
import ProductCard from '../../components/ProductCard';
import useStore from '../../states/global';
import FormattedPrice from '../../components/FormattedPrice';
import useNotify from '../../hooks/useNotify';
import { useDollarRate } from '../../hooks/useDollarRate';
import Rating from '../../components/Rating';

const ProductDetailPage = () => {
  const { notify } = useNotify()
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart, cart, user, incrementQuantity, decrementQuantity, removeFromCart } = useStore();
  const { freeShippingThreshold } = useDollarRate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Question states
  const [, setQuestions] = useState<any[]>([]); 
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [, setLoadingQuestions] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await request.get(`${apiUrl}/products/${id}`);
        const productData = response.data.body.product;

        
        
        if (productData) {
          const processedProduct = {
            ...productData,
            rating: productData.rating || 0,
            reviews: productData.reviews || 0,
            image: productData.images && productData.images.length > 0
              ? `${imagesUrl}${productData.images[0].image}`
              : '/placeholder-product.svg',
            images: productData.images && productData.images.length > 0
              ? productData.images.map((img: any) => `${imagesUrl}${img.image}`)
              : ['/placeholder-product.svg'],
            category: productData.categories,
            categories: productData.categories,
            subcategories: productData.subcategories,
            brand: productData.brand,
            model: productData.model,
            garantia: productData.garantia,
            discount: productData.discount || 0,
            originalPrice: Number(productData.price),
            price: productData.discount > 0
              ? Number(productData.price) * (1 - (Number(productData.discount) / 100))
              : Number(productData.price)
          };
          setProduct(processedProduct);
          setNotFound(false);
        } else {
          setNotFound(true);
        } 
      } catch (error) {
        console.error('Error fetching product:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | Repuestos Picha`;
    }
  }, [product?.name]);

  useEffect(() => {
    if (id) {
      fetchQuestions();
    }
  }, [id]);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const response = await request.get(`${apiUrl}/questions/product/${id}`);
      setQuestions(response.data.body.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      notify.info('Debes iniciar sesión para realizar una pregunta');
      return;
    }
    if (!newQuestion.trim()) return;

    try {
      setIsSubmittingQuestion(true);
      await request.post(`${apiUrl}/questions`, {
        productId: id,
        clientId: user.id,
        questionText: newQuestion
      });
      setNewQuestion('');
      notify.info('Tu pregunta ha sido enviada. Podrás ver la respuesta en la sección de preguntas dentro de tu perfil.');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
      notify.error('Error al enviar la pregunta');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, el producto que estás buscando no existe o no está disponible en este momento.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Volver a la página principal
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product as any);
    }
    notify.success(`${product.name} agregado al carrito`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder-product.svg';
  };

  const isInCart = cart.some(item => item.id === product.id);
  const cartItem = cart.find(item => item.id === product.id);
  const cartItemCount = cartItem ? cartItem.quantity : 0;

  const productImages = product.images;

  return (
    <>
      <CartModal />

      <ImageGallery
        images={productImages}
        initialIndex={selectedImage}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div
                className="aspect-square bg-white rounded-lg overflow-hidden shadow-md cursor-zoom-in relative group"
                onClick={() => setIsGalleryOpen(true)}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <Search className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image: any, index: any) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? 'border-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                {/* Compatibility Info */}
                {product.years && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 font-medium">
                      Este producto es compatible con vehiculos del año {product.years.split('-')[0]} hasta el año {product.years.split('-')[1] || product.years.split('-')[0]}
                    </p>
                  </div>
                )}
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-3">
                  <Rating hover={false} action={() => { }} stars={Math.round(product.rating)} />
                  <span className="text-sm text-gray-500 font-medium">
                    {product.rating > 0 ? product.rating.toFixed(1) : 'Sin calificaciones'} ({product.reviews} {product.reviews === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  {product.discount > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base text-gray-400 line-through">
                        <FormattedPrice price={product.originalPrice} />
                      </span>
                      <span className="text-xl font-bold text-red-600">
                        {product.discount}% OFF
                      </span>
                    </div>
                  )}
                  <div className="text-5xl font-extrabold text-red-600">
                    <FormattedPrice price={product.price} />
                  </div>
                </div>
              </div>
              {/* Description */}
              {product?.description &&
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              }

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Especificaciones</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Categoría:</span>
                    <p className="text-gray-600">{product.category || 'N/A'}, {product.subcategories || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Marca:</span>
                    <p className="text-gray-600">{product.brand || 'N/A'}, {product.model || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Calificación:</span>
                    <p className="text-gray-600">{product.rating > 0 ? `${product.rating.toFixed(1)}/5` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Disponibilidad:</span>
                    <p className="text-green-600">En stock</p>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                {!isInCart ? (
                  <>
                    <div className="flex items-center gap-4">
                      <label htmlFor="quantity" className="font-medium text-gray-700">
                        Cantidad:
                      </label>
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors text-gray-600 border-r border-gray-300"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-bold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors text-gray-600 border-l border-gray-300"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200"
                      >
                        <ShoppingCart size={22} />
                        Agregar al carrito
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      Este producto ya está en tu carrito
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white border-2 border-red-100 rounded-xl overflow-hidden flex-1 h-14">
                        <button
                          onClick={() => decrementQuantity(product.id)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-red-50 transition-colors text-red-600 disabled:opacity-30"
                          disabled={cartItemCount <= 1}
                        >
                          <Minus size={20} />
                        </button>
                        <span className="w-16 text-center text-xl font-bold text-gray-800">
                          {cartItemCount}
                        </span>
                        <button
                          onClick={() => incrementQuantity(product.id)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-red-50 transition-colors text-red-600"
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                        title="Eliminar del carrito"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                      Ir a pagar
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Envío gratuito en compras mayores a ${Number(freeShippingThreshold).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>

                  {product.garantia && ` ${product.garantia}`}
                </div>
              </div>
            </div>
          </div>

          {/* Questions and Answers Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <MessageSquare className="text-red-500" />
              Realizar una pregunta sobre este articulo
            </h2>
            <p className='text-sm text-gray-500 mb-3'>Las preguntas realizadas las veras en la seccion de preguntas en tu perfil de usuario</p>

            {/* Question Input */}
            <form onSubmit={handleQuestionSubmit} className="mb-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Escribe tu pregunta aquí..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    disabled={isSubmittingQuestion}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion || !newQuestion.trim()}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                >
                  {isSubmittingQuestion ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Preguntar</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
              {!user && (
                <p className="text-sm text-gray-500 mt-2">
                  Debes <span className="text-red-600 font-medium cursor-pointer" onClick={() => navigate('/auth')}>iniciar sesión</span> para preguntar.
                </p>
              )}
            </form>
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            {products
              .filter(p => p.categories === product?.categories && p.id !== product?.id)
              .length > 0 &&
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Productos relacionados</h2>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {products
                .filter(p => p.categories === product?.categories && p.id !== product?.id)
                .sort((a, b) => b.id - a.id)
                .slice(0, 6)
                .map(relatedProductRaw => {
                  const raw = relatedProductRaw as any;
                  // Adaptamos el objeto al formato que espera ProductCard
                  const productForCard = {
                    ...raw,
                    category: raw.categories,
                    rating: raw.rating || 0,
                    reviews: raw.reviews || 0
                  };

                  return (
                    <ProductCard
                      key={productForCard.id}
                      product={productForCard}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ProductDetailPage;

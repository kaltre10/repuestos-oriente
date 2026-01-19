import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShoppingCart, Heart, Share2, Loader2, MessageSquare, Send } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { imagesUrl, apiUrl } from '../../utils/utils';
import request from '../../utils/request';
import CartModal from '../../components/CartModal';
import useStore from '../../states/global';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart, user } = useStore();
  const { products, loading } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Question states
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const productFromDB = products.find(p => p.id === parseInt(id || '0'));

  const product = productFromDB ? {
    ...productFromDB,
    rating: (productFromDB as any).rating || 5,
    reviews: (productFromDB as any).reviews || 0,
    image: (productFromDB as any).images && (productFromDB as any).images.length > 0
      ? `${imagesUrl}${(productFromDB as any).images[0].image}`
      : '/placeholder-product.png',
    images: (productFromDB as any).images && (productFromDB as any).images.length > 0
      ? (productFromDB as any).images.map((img: any) => `${imagesUrl}${img.image}`)
      : ['/placeholder-product.png'],
    category: (productFromDB as any).categories
  } : null;

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
      alert('Debes iniciar sesión para realizar una pregunta');
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
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error al enviar la pregunta');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  useEffect(() => {
    if (!loading && !product && products.length > 0) {
      navigate('/productos');
    }
  }, [product, loading, products, navigate]);

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

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product as any);
    }
  };

  const isInCart = cart.some(item => item.id === product.id);
  const cartItemCount = cart.filter(item => item.id === product.id).length;

  const productImages = product.images;

  return (
    <>
      <CartModal />

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
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
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

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill={i < product.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviews} reseñas)</span>
                </div>

                {/* Price */}
                <div className="text-4xl font-bold text-red-500 mb-6">
                  ${Number(product.price).toFixed(2)}
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
                    <p className="text-gray-600">{product.category || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Marca:</span>
                    <p className="text-gray-600">{product.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Calificación:</span>
                    <p className="text-gray-600">{product.rating}/5 estrellas</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Disponibilidad:</span>
                    <p className="text-green-600">En stock</p>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="font-medium text-gray-700">
                    Cantidad:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart && cartItemCount >= 10}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${isInCart && cartItemCount >= 10
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                  >
                    <ShoppingCart size={20} />
                    {isInCart ? `Agregado (${cartItemCount})` : 'Agregar al carrito'}
                  </button>

                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart size={20} className="text-gray-600" />
                  </button>

                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Envío gratuito en compras mayores a $20
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Devolución gratuita dentro de 30 días
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Garantía de 1 año
                </div>
              </div>
            </div>
          </div>

          {/* Questions and Answers Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <MessageSquare className="text-red-500" />
              Preguntas y Respuestas
            </h2>

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

            {/* Questions List */}
            <div className="space-y-8">
              {loadingQuestions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              ) : questions.length > 0 ? (
                questions.map((q) => (
                  <div key={q.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <MessageSquare size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium mb-1">{q.questionText}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{q.client?.name || 'Cliente'}</span>
                          <span>•</span>
                          <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {q.status === 1 ? (
                      <div className="ml-12 bg-gray-50 p-4 rounded-xl border-l-4 border-red-500">
                        <div className="flex items-start gap-3">
                          <div className="text-red-600 mt-1">
                            <Send size={16} className="rotate-180" />
                          </div>
                          <div>
                            <p className="text-gray-700 text-sm leading-relaxed">{q.answerText}</p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Respuesta del vendedor</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="ml-12 text-sm text-gray-400 italic">Pendiente de respuesta...</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Aún no hay preguntas. ¡Sé el primero en preguntar!</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => p.categories === productFromDB?.categories && p.id !== product.id)
                .slice(0, 4)
                .map(relatedProductRaw => {
                  const relatedProduct = {
                    ...relatedProductRaw,
                    image: (relatedProductRaw as any).images && (relatedProductRaw as any).images.length > 0
                      ? `${imagesUrl}${(relatedProductRaw as any).images[0].image}`
                      : '/placeholder-product.png',
                    category: (relatedProductRaw as any).categories
                  };

                  return (
                    <div
                      key={relatedProduct.id}
                      onClick={() => navigate(`/producto/${relatedProduct.id}`)}
                      className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">{relatedProduct.category}</p>
                        <h3 className="font-semibold text-gray-800 mb-2 truncate">{relatedProduct.name}</h3>
                        <p className="text-red-500 font-bold">${Number(relatedProduct.price).toFixed(2)}</p>
                      </div>
                    </div>
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

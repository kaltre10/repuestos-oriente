import { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';
import useStore from '../../states/global';
import { Link } from 'react-router-dom';

const Questions = () => {
  const { user } = useStore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchMyQuestions();
    }
  }, [user]);

  const fetchMyQuestions = async () => {
    try {
      setLoading(true);
      const response = await request.get(`${apiUrl}/questions/client/${user?.id}`);
      setQuestions(response.data.body.questions);
    } catch (error) {
      console.error('Error fetching my questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-red-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">Mis Preguntas</h1>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          Total: {questions.length}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Cargando tus preguntas...</p>
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden transition-all hover:shadow-md">
              <div className="p-5">
                {/* Product Header */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                  <Link to={`/producto/${q.productId}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {q.product?.images?.[0] ? (
                        <img 
                          src={`${imagesUrl}${q.product.images[0].image}`} 
                          alt={q.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <MessageSquare size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">{q.product?.name}</h3>
                      <p className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()} a las {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </Link>
                  
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    q.status === 1 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {q.status === 1 ? (
                      <><CheckCircle size={12} /> Respondida</>
                    ) : (
                      <><Clock size={12} /> Pendiente</>
                    )}
                  </span>
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600 flex-shrink-0 mt-0.5">
                      <MessageSquare size={16} />
                    </div>
                    <p className="text-gray-700 text-sm font-medium">{q.questionText}</p>
                  </div>
                </div>

                {/* Answer Area */}
                <div className="ml-9">
                  {q.status === 1 ? (
                    <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-red-500">
                      <div className="flex items-start gap-3">
                        <div className="text-red-600 mt-1">
                          <Send size={14} className="rotate-180" />
                        </div>
                        <div>
                          <p className="text-gray-700 text-sm leading-relaxed">{q.answerText}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-tighter">Respuesta del vendedor</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 italic text-sm py-2">
                      <Clock size={14} />
                      <span>Esperando respuesta del vendedor...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No has realizado preguntas</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Cuando tengas dudas sobre un producto, puedes preguntar directamente desde la página del mismo.
          </p>
          <Link 
            to="/productos" 
            className="inline-flex items-center justify-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Explorar Productos
          </Link>
        </div>
      )}
    </div>
  );
};

export default Questions;

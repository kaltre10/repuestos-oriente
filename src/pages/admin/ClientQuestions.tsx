import { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, Search, Loader2 } from 'lucide-react';
import { apiUrl, imagesUrl } from '../../utils/utils';
import request from '../../utils/request';

const ClientQuestions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submittingIds, setSubmittingIds] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await request.get(`${apiUrl}/questions/all`);
      setQuestions(response.data.body.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId: number) => {
    const answerText = answers[questionId];
    if (!answerText || !answerText.trim()) return;

    try {
      setSubmittingIds(prev => ({ ...prev, [questionId]: true }));
      await request.put(`${apiUrl}/questions/${questionId}/answer`, {
        answerText: answerText.trim()
      });
      
      // Clear answer for this question
      setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });

      // Refresh questions
      fetchQuestions();
    } catch (error) {
      console.error('Error answering question:', error);
      alert('Error al enviar la respuesta');
    } finally {
      setSubmittingIds(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Preguntas de Clientes</h1>
          <p className="text-gray-500 mt-1">Gestiona y responde las dudas de tus compradores</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por pregunta, producto o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Cargando preguntas...</p>
        </div>
      ) : filteredQuestions.length > 0 ? (
        <div className="space-y-6">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                {/* Header: Product and Client info */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {q.product?.images?.[0] ? (
                        <img 
                          src={`${imagesUrl}${q.product.images[0].image}`} 
                          alt={q.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <MessageSquare size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{q.product?.name || 'Producto desconocido'}</h3>
                      <p className="text-sm text-gray-500">Cliente: <span className="font-medium text-gray-700">{q.client?.name || 'Anónimo'}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      q.status === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {q.status === 1 ? (
                        <>
                          <CheckCircle size={14} />
                          Respondida
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          Pendiente
                        </>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 flex-shrink-0 mt-1">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-gray-800 leading-relaxed font-medium">{q.questionText}</p>
                    </div>
                  </div>
                </div>

                {/* Answer Area */}
                <div className="ml-11">
                  {q.status === 1 ? (
                    <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                      <div className="flex items-start gap-3">
                        <div className="text-green-600 mt-1">
                          <Send size={16} className="rotate-180" />
                        </div>
                        <div>
                          <p className="text-gray-700 text-sm leading-relaxed">{q.answerText}</p>
                          <p className="text-xs text-gray-400 mt-2">Tu respuesta enviada el {new Date(q.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <textarea
                        rows={3}
                        placeholder="Escribe tu respuesta aquí..."
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                        disabled={submittingIds[q.id]}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleAnswerSubmit(q.id)}
                          disabled={!answers[q.id]?.trim() || submittingIds[q.id]}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                        >
                          {submittingIds[q.id] ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <>
                              <span>Enviar Respuesta</span>
                              <Send size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron preguntas</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm ? 'No hay resultados para tu búsqueda actual.' : 'Aún no hay preguntas de clientes para gestionar.'}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-red-600 font-semibold hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientQuestions;

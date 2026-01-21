import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Banknote, Mail, Phone, Hash, ChevronRight, Loader2, Info, Copy, Check } from 'lucide-react';
import request from '../../utils/request';
import { apiUrl, bancos } from '../../utils/utils';
import useNotify from '../../hooks/useNotify';

interface PaymentMethod {
  id: number;
  name: string;
  type: 'Pago Movil' | 'Zelle' | 'Transferencia' | 'Efectivo';
  bank?: string;
  email?: string;
  accountNumber?: string;
  phone?: string;
  ci_rif?: string;
  isActive: boolean;
}

const Payments = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { notify } = useNotify();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await request.get(`${apiUrl}/payment-methods?onlyActive=true`);
      if (response.data.success) {
        setPaymentMethods(response.data.body.paymentMethods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      notify.error('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify.success('Copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBankName = (code: string) => {
    const banco = bancos.find(b => b.codigo === code);
    return banco ? banco.nombre : code;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Pago Movil': return <Smartphone className="w-6 h-6" />;
      case 'Zelle': return <Mail className="w-6 h-6" />;
      case 'Transferencia': return <CreditCard className="w-6 h-6" />;
      case 'Efectivo': return <Banknote className="w-6 h-6" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Pago Movil': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Zelle': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Transferencia': return 'bg-green-100 text-green-700 border-green-200';
      case 'Efectivo': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleCopy(text, id);
      }}
      className="ml-auto p-2 hover:bg-white rounded-lg transition-all group/btn"
      title="Copiar dato"
    >
      {copiedId === id ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando métodos de pago...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-50 rounded-2xl">
            <CreditCard className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Métodos de Pago</h1>
            <p className="text-gray-500">Consulta los datos para realizar tus pagos de forma segura</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 mb-8">
          <Info className="w-6 h-6 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700 leading-relaxed">
            Utiliza estos datos para realizar tu transferencia o pago móvil. Una vez realizado, recuerda adjuntar el comprobante en tu sección de <strong>Mis Compras</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className="group relative bg-gray-50 hover:bg-white border border-gray-100 hover:border-red-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl border ${getTypeColor(method.type)} transition-colors`}>
                    {getIcon(method.type)}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getTypeColor(method.type)}`}>
                    {method.type}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                    {method.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {method.bank && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-2 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Banco</p>
                          <p className="font-semibold text-gray-700">{getBankName(method.bank)}</p>
                        </div>
                        <CopyButton text={getBankName(method.bank)} id={`bank-${method.id}`} />
                      </div>
                    )}

                    {method.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-2 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</p>
                          <p className="font-semibold text-gray-700">{method.phone}</p>
                        </div>
                        <CopyButton text={method.phone} id={`phone-${method.id}`} />
                      </div>
                    )}

                    {method.email && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-2 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Correo / Zelle</p>
                          <p className="font-semibold text-gray-700">{method.email}</p>
                        </div>
                        <CopyButton text={method.email} id={`email-${method.id}`} />
                      </div>
                    )}

                    {method.accountNumber && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-2 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                          <Hash className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Número de Cuenta</p>
                          <p className="font-semibold text-gray-700 break-all">{method.accountNumber}</p>
                        </div>
                        <CopyButton text={method.accountNumber} id={`acc-${method.id}`} />
                      </div>
                    )}

                    {method.ci_rif && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-2 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                          <Hash className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">C.I. / RIF</p>
                          <p className="font-semibold text-gray-700">{method.ci_rif}</p>
                        </div>
                        <CopyButton text={method.ci_rif} id={`ci-${method.id}`} />
                      </div>
                    )}
                  </div>
                </div>

                
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No hay métodos de pago configurados actualmente.</p>
              <p className="text-gray-400 text-sm mt-1">Por favor, contacta con soporte si necesitas ayuda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;

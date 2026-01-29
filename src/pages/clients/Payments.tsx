import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Banknote, Mail, Phone, Hash, Loader2, Info, Copy, Check } from 'lucide-react';
import request from '../../utils/request';
import { apiUrl, bancos } from '../../utils/utils';
import useNotify from '../../hooks/useNotify';

interface PaymentType {
  id: number;
  name: string;
  properties: string[];
}

interface PaymentMethod {
  id: number;
  name: string;
  paymentTypeId: number;
  paymentType?: PaymentType;
  properties: Record<string, string>;
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
        const validatedMethods = response.data.body.paymentMethods.map((method: any) => {
          let properties = method.properties || {};
          if (typeof properties === 'string') {
            try {
              properties = JSON.parse(properties);
            } catch (e) {
              properties = {};
            }
          }
          if (typeof properties !== 'object' || properties === null || Array.isArray(properties)) {
            properties = {};
          }
          const validatedPaymentType = method.paymentType ? {
            ...method.paymentType,
            properties: Array.isArray(method.paymentType.properties) ? method.paymentType.properties : []
          } : undefined;
          return {
            ...method,
            properties,
            paymentType: validatedPaymentType
          };
        });
        setPaymentMethods(validatedMethods);
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

  const getIcon = (typeName: string) => {
    const type = typeName.toLowerCase();
    if (type.includes('pago movil') || type.includes('movil')) return <Smartphone className="w-6 h-6" />;
    if (type.includes('zelle')) return <Mail className="w-6 h-6" />;
    if (type.includes('transferencia') || type.includes('banco')) return <CreditCard className="w-6 h-6" />;
    if (type.includes('efectivo')) return <Banknote className="w-6 h-6" />;
    return <CreditCard className="w-6 h-6" />;
  };

  const getTypeColor = (typeName: string) => {
    const type = typeName.toLowerCase();
    if (type.includes('pago movil') || type.includes('movil')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (type.includes('zelle')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (type.includes('transferencia') || type.includes('banco')) return 'bg-green-100 text-green-700 border-green-200';
    if (type.includes('efectivo')) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
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
            Utiliza estos datos para realizar tu pago. Una vez realizado, recuerda adjuntar el comprobante en tu sección de <strong>Mis Compras</strong>.
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
                  <div className={`p-3 rounded-2xl border ${getTypeColor(method.paymentType?.name || '')} transition-colors`}>
                    {getIcon(method.paymentType?.name || '')}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getTypeColor(method.paymentType?.name || '')}`}>
                    {method.paymentType?.name || 'Otro'}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                    {method.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(method.properties).map(([key, value]) => {
                      // Obtener el ícono apropiado según la clave
                      const getPropertyIcon = () => {
                        const keyLower = key.toLowerCase();
                        if (keyLower.includes('banco')) return <CreditCard className="w-4 h-4" />;
                        if (keyLower.includes('teléfono') || keyLower.includes('phone') || keyLower.includes('celular') || keyLower.includes('movil')) return <Phone className="w-4 h-4" />;
                        if (keyLower.includes('email') || keyLower.includes('correo')) return <Mail className="w-4 h-4" />;
                        if (keyLower.includes('cuenta') || keyLower.includes('numero') || keyLower.includes('num')) return <Hash className="w-4 h-4" />;
                        if (keyLower.includes('ci') || keyLower.includes('rif') || keyLower.includes('identificacion')) return <Hash className="w-4 h-4" />;
                        return <CreditCard className="w-4 h-4" />;
                      };
                      
                      // Formatear el valor si es un banco
                      const displayValue = key.toLowerCase().includes('banco') ? getBankName(value) : value;
                      
                      // Capitalizar el nombre de la propiedad para mostrar
                      const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                      
                      return (
                        <div key={key} className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-2 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                            {getPropertyIcon()}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{displayKey}</p>
                            <p className="font-semibold text-gray-700 break-all">{displayValue}</p>
                          </div>
                          <CopyButton text={displayValue} id={`${key}-${method.id}`} />
                        </div>
                      );
                    })}
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

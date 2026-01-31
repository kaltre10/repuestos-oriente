import { useState, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  X, 
  CreditCard, 
  Settings2,
  AlertCircle
} from 'lucide-react';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import useNotify from '../../hooks/useNotify';
import { useConfirm } from '../../hooks/useConfirm';

interface PaymentType {
  id: number;
  name: string;
  properties: string[];
  createdAt: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  paymentTypeId: number;
  paymentType?: PaymentType;
  properties: Record<string, string>;
  isActive: boolean;
  createdAt: string;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    paymentTypeId: 0,
    properties: {} as Record<string, string>,
    isActive: true,
  });
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    properties: [] as string[],
  });
  const [newPropertyName, setNewPropertyName] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [typeFormLoading, setTypeFormLoading] = useState(false);
  const { notify } = useNotify();
  const confirm = useConfirm();

  const fetchPaymentTypes = async () => {
    try {
      const response = await request.get(`${apiUrl}/payment-types`);
      const validatedTypes = response.data.body.paymentTypes.map((type: any) => {
        let properties = type.properties;
        if (typeof properties === 'string') {
          try {
            properties = JSON.parse(properties);
          } catch (e) {
            properties = [];
          }
        }
        properties = Array.isArray(properties) ? properties : [];
        return {
          ...type,
          properties
        };
      });
      setPaymentTypes(validatedTypes);
    } catch (error) {
      console.error('Error fetching payment types:', error);
      notify.error('Error al cargar los tipos de pago');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await request.get(`${apiUrl}/payment-methods`);
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
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      notify.error('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchPaymentMethods(),
        fetchPaymentTypes()
      ]);
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'paymentTypeId' 
        ? parseInt(value, 10) 
        : (type === 'checkbox' ? (e.target as HTMLInputElement).checked : value),
      ...(name === 'paymentTypeId' ? { properties: {} } : {})
    }));
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    let properties = method.properties || {};
    if (typeof properties === 'string') {
      try {
        properties = JSON.parse(properties);
      } catch (e) {
        properties = {};
      }
    }
    setFormData({
      name: method.name,
      paymentTypeId: method.paymentTypeId,
      properties: properties,
      isActive: method.isActive,
    });
    setShowForm(true);
  };

  const handlePropertyChange = (propertyName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [propertyName]: value
      }
    }));
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm('¿Estás seguro de que deseas eliminar este método de pago?');
    if (!isConfirmed) return;

    try {
      await request.delete(`${apiUrl}/payment-methods/${id}`);
      notify.success('Método de pago eliminado correctamente');
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      notify.error('Error al eliminar el método de pago');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const dataToSend = {
        ...formData
      };

      if (editingId) {
        await request.put(`${apiUrl}/payment-methods/${editingId}`, dataToSend);
        notify.success('Método de pago actualizado correctamente');
      } else {
        await request.post(`${apiUrl}/payment-methods`, dataToSend);
        notify.success('Método de pago creado correctamente');
      }
      handleCloseForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      notify.error('Error al guardar el método de pago');
    } finally {
      setFormLoading(false);
    }
  };

  const handleTypeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTypeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProperty = () => {
    if (newPropertyName && !typeFormData.properties.includes(newPropertyName)) {
      setTypeFormData((prev) => ({
        ...prev,
        properties: [...prev.properties, newPropertyName],
      }));
      setNewPropertyName('');
    }
  };

  const removeProperty = (property: string) => {
    setTypeFormData((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p !== property),
    }));
  };

  const handleTypeEdit = (type: PaymentType) => {
    setEditingTypeId(type.id);
    const propertiesToSet = Array.isArray(type.properties) ? [...type.properties] : [];
    setTypeFormData({
      name: type.name,
      properties: propertiesToSet,
    });
    setShowTypeForm(true);
  };

  const handleTypeDelete = async (id: number) => {
    const isConfirmed = await confirm('¿Estás seguro de que deseas eliminar este tipo de pago?');
    if (!isConfirmed) return;

    try {
      await request.delete(`${apiUrl}/payment-types/${id}`);
      notify.success('Tipo de pago eliminado correctamente');
      fetchPaymentTypes();
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment type:', error);
      notify.error('Error al eliminar el tipo de pago');
    }
  };

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setTypeFormLoading(true);
      const dataToSend = {
        ...typeFormData,
      };

      if (editingTypeId) {
        await request.put(`${apiUrl}/payment-types/${editingTypeId}`, dataToSend);
        notify.success('Tipo de pago actualizado correctamente');
      } else {
        await request.post(`${apiUrl}/payment-types`, dataToSend);
        notify.success('Tipo de pago creado correctamente');
      }
      handleCloseTypeForm();
      fetchPaymentTypes();
    } catch (error) {
      console.error('Error saving payment type:', error);
      notify.error('Error al guardar el tipo de pago');
    } finally {
      setTypeFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      paymentTypeId: 0,
      properties: {},
      isActive: true,
    });
  };

  const handleCloseTypeForm = () => {
    setShowTypeForm(false);
    setEditingTypeId(null);
    setTypeFormData({
      name: '',
      properties: [],
    });
    setNewPropertyName('');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Métodos de Pago</h1>
          <p className="text-sm text-gray-500 mt-1 italic">Gestiona las opciones de pago disponibles para los clientes</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => setShowTypeForm(true)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-emerald-100 active:scale-95"
          >
            <Settings2 className="w-5 h-5" />
            <span>Tipo de Pago</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Método</span>
          </button>
        </div>
      </div>

      {/* Sección de Tipos de Pago */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-800">Tipos de Pago</h2>
        </div>
        <div className="bg-white rounded-[1.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Propiedades</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paymentTypes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <AlertCircle className="w-8 h-8" />
                        <p>No hay tipos de pago configurados.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paymentTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{type.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(type.properties) && type.properties.length > 0 ? (
                            type.properties.map((property, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {property}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Sin propiedades</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleTypeEdit(type)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTypeDelete(type.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-gray-100">
            {paymentTypes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No hay tipos de pago configurados.</p>
              </div>
            ) : (
              paymentTypes.map((type) => (
                <div key={type.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-gray-900">{type.name}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTypeEdit(type)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTypeDelete(type.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(type.properties) && type.properties.map((property, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        {property}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sección de Métodos de Pago */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Métodos de Pago</h2>
        </div>
        <div className="bg-white rounded-[1.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Datos Principales</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paymentMethods.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <AlertCircle className="w-8 h-8" />
                        <p>No hay métodos de pago configurados.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paymentMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{method.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
                          {method.paymentType?.name || 'No especificado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {(() => {
                            const properties = method.properties || {};
                            const entries = Object.entries(properties);
                            if (entries.length === 0) return <span className="text-xs text-gray-400 italic">Sin datos</span>;
                            return entries.map(([key, value]) => (
                              <div key={key} className="text-xs">
                                <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">{key}:</span>
                                <span className="ml-1 text-gray-700">{String(value) || '-'}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          method.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {method.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {method.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(method)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden divide-y divide-gray-100">
            {paymentMethods.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No hay métodos de pago configurados.</p>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div key={method.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-bold text-gray-900">{method.name}</div>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        {method.paymentType?.name || 'No especificado'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    {Object.entries(method.properties || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider">{key}</span>
                        <span className="text-gray-700 font-medium">{String(value) || '-'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      method.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {method.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {method.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Form for Payment Methods */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseForm}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {editingId ? 'Editar Método' : 'Nuevo Método'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configura los detalles del método de pago.</p>
              </div>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      Nombre del Método
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Transferencia Banesco"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      Tipo de Pago
                    </label>
                    <select
                      name="paymentTypeId"
                      value={formData.paymentTypeId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium appearance-none"
                      required
                    >
                      <option value={0}>Selecciona un tipo...</option>
                      {paymentTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  {formData.paymentTypeId > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-blue-600" />
                        Campos Requeridos
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {paymentTypes.find(t => t.id === formData.paymentTypeId)?.properties.map((prop) => (
                          <div key={prop}>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                              {prop}
                            </label>
                            <input
                              type="text"
                              value={formData.properties[prop] || ''}
                              onChange={(e) => handlePropertyChange(prop, e.target.value)}
                              placeholder={`Ingresa ${prop.toLowerCase()}`}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-gray-700">
                      Método de pago activo
                    </label>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {formLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{editingId ? 'Guardar Cambios' : 'Crear Método'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form for Payment Types */}
      {showTypeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseTypeForm}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {editingTypeId ? 'Editar Tipo' : 'Nuevo Tipo'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Define las propiedades de este tipo de pago.</p>
              </div>
              <button
                onClick={handleCloseTypeForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 md:p-8">
              <form onSubmit={handleTypeSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      Nombre del Tipo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={typeFormData.name}
                      onChange={handleTypeInputChange}
                      placeholder="Ej: Pago Móvil, Zelle"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="pt-4 space-y-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      Propiedades Necesarias
                    </label>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPropertyName}
                        onChange={(e) => setNewPropertyName(e.target.value)}
                        placeholder="Ej: Banco, Teléfono"
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={addProperty}
                        disabled={!newPropertyName.trim()}
                        className="px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      {typeFormData.properties.length > 0 ? (
                        typeFormData.properties.map((property) => (
                          <div key={property} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-200">
                            <span className="text-sm font-medium text-gray-700">{property}</span>
                            <button
                              type="button"
                              onClick={() => removeProperty(property)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic w-full text-center py-2">No hay propiedades agregadas</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={handleCloseTypeForm}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={typeFormLoading}
                    className="flex-[2] px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {typeFormLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{editingTypeId ? 'Guardar Cambios' : 'Crear Tipo'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Métodos de Pago</h1>
          <p className="text-gray-500">Gestiona las opciones de pago disponibles para los clientes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTypeForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Tipo de Pago
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Nuevo Método
          </button>
        </div>
      </div>

      {/* Sección de Tipos de Pago */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tipos de Pago</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Propiedades</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentTypes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-gray-500 sm:px-6">
                      No hay tipos de pago configurados. Usa el botón "Tipo de Pago" para crear uno.
                    </td>
                  </tr>
                ) : (
                  paymentTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <div className="text-sm font-medium text-gray-900">{type.name}</div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="text-xs text-gray-500 space-y-1">
                          {Array.isArray(type.properties) ? (
                            type.properties.length > 0 ? (
                              type.properties.map((property, index) => (
                                <div key={index} className="inline-block mr-2 mb-1 bg-gray-100 px-2 py-1 rounded">
                                  {property}
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-400 italic">No hay propiedades configuradas</div>
                            )
                          ) : (
                            <div className="text-gray-400 italic">No hay propiedades configuradas</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTypeEdit(type)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Editar"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleTypeDelete(type.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sección de Métodos de Pago */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Métodos de Pago</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Tipo de Pago</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Datos Principales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentMethods.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 sm:px-6">
                      No hay métodos de pago configurados.
                    </td>
                  </tr>
                ) : (
                  paymentMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <div className="text-sm font-medium text-gray-900">{method.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <div className="text-sm text-gray-700">{method.paymentType?.name || 'No especificado'}</div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="text-xs text-gray-500 space-y-1">
                          {(() => {
                            const properties = method.properties || {};
                            const entries = Object.entries(properties);
                            
                            if (entries.length === 0) {
                              return <div className="text-gray-400 italic">No hay propiedades configuradas</div>;
                            }
                            
                            return entries.map(([key, value]) => (
                              <div key={key} className="flex flex-wrap gap-1">
                                <span className="font-semibold text-gray-700">{key}:</span>
                                <span className="text-gray-600">{value || '-'}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        {method.isActive ? (
                          <span className="flex items-center text-green-600 text-sm">
                            <FaCheck className="mr-1" />
                            <span className="hidden sm:inline">Activo</span>
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 text-sm">
                            <FaTimes className="mr-1" />
                            <span className="hidden sm:inline">Inactivo</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(method)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Editar"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form for Payment Methods */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
              </h2>
              <button onClick={handleCloseForm} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Método *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Transferencia Banesco"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Pago *</label>
                  <select
                    name="paymentTypeId"
                    value={formData.paymentTypeId}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  >
                    <option value={0} disabled>Seleccione un tipo de pago</option>
                    {paymentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Campos dinámicos basados en el tipo de pago seleccionado */}
              {formData.paymentTypeId > 0 && (
                <div className="pt-4">
                  {(() => {
                    const selectedType = paymentTypes.find(type => type.id === formData.paymentTypeId);
                    const properties = selectedType && Array.isArray(selectedType.properties) ? selectedType.properties : [];
                    
                    return (
                      <>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Propiedades de {selectedType?.name}
                        </h3>
                        
                        {properties.length > 0 ? (
                          <div className="space-y-3">
                            {properties.map((propertyName) => (
                              <div key={propertyName} className="flex gap-2 items-center">
                                <div className="flex-1">
                                  <label className="block text-sm font-semibold text-gray-700 mb-1 capitalize">{propertyName}</label>
                                  <input
                                    type="text"
                                    value={formData.properties[propertyName] || ''}
                                    onChange={(e) => handlePropertyChange(propertyName, e.target.value)}
                                    placeholder={`Valor para ${propertyName}`}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Este tipo de pago no tiene propiedades configuradas</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Método de pago activo
                </label>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center"
                >
                  {formLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    editingId ? 'Actualizar' : 'Crear Método'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form for Payment Types */}
      {showTypeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTypeId ? 'Editar Tipo de Pago' : 'Nuevo Tipo de Pago'}
              </h2>
              <button onClick={handleCloseTypeForm} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleTypeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Tipo *</label>
                <input
                  type="text"
                  name="name"
                  value={typeFormData.name}
                  onChange={handleTypeInputChange}
                  placeholder="Ej: Pago Móvil, Zelle, Transferencia"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Sección de Propiedades */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Propiedades Necesarias</h3>
                
                {/* Agregar Nueva Propiedad */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newPropertyName}
                    onChange={(e) => setNewPropertyName(e.target.value)}
                    placeholder="Nombre de la propiedad (ej: Banco, Teléfono, CI/RIF)"
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addProperty}
                    disabled={!newPropertyName.trim()}
                    className={`px-4 py-2.5 rounded-lg font-semibold transition-colors ${!newPropertyName.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    Agregar
                  </button>
                </div>
                
                {/* Lista de Propiedades */}
                {Array.isArray(typeFormData.properties) ? (
                  typeFormData.properties.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {typeFormData.properties.map((property, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{property}</span>
                          <button
                            type="button"
                            onClick={() => removeProperty(property)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar propiedad"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay propiedades agregadas</p>
                  )
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay propiedades agregadas</p>
                )}
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleCloseTypeForm}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={typeFormLoading}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex justify-center items-center"
                >
                  {typeFormLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    editingTypeId ? 'Actualizar' : 'Crear Tipo'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
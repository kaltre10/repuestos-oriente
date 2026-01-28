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

const PaymentTypes = () => {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    properties: [] as string[],
  });
  const [newPropertyName, setNewPropertyName] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const { notify } = useNotify();
  const confirm = useConfirm();

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  const fetchPaymentTypes = async () => {
    try {
      setLoading(true);
      const response = await request.get(`${apiUrl}/payment-types`);
      setPaymentTypes(response.data.body.paymentTypes);
    } catch (error) {
      console.error('Error fetching payment types:', error);
      notify.error('Error al cargar los tipos de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (type: PaymentType) => {
    setEditingId(type.id);
    setFormData({
      name: type.name,
      properties: type.properties || [],
    });
    setShowForm(true);
  };

  const addProperty = () => {
    if (newPropertyName && !formData.properties.includes(newPropertyName)) {
      setFormData((prev) => ({
        ...prev,
        properties: [...prev.properties, newPropertyName],
      }));
      setNewPropertyName('');
    }
  };

  const removeProperty = (property: string) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p !== property),
    }));
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm('¿Estás seguro de que deseas eliminar este tipo de pago?');
    if (!isConfirmed) return;

    try {
      await request.delete(`${apiUrl}/payment-types/${id}`);
      notify.success('Tipo de pago eliminado correctamente');
      fetchPaymentTypes();
    } catch (error) {
      console.error('Error deleting payment type:', error);
      notify.error('Error al eliminar el tipo de pago');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const dataToSend = {
        ...formData,
      };

      if (editingId) {
        await request.put(`${apiUrl}/payment-types/${editingId}`, dataToSend);
        notify.success('Tipo de pago actualizado correctamente');
      } else {
        await request.post(`${apiUrl}/payment-types`, dataToSend);
        notify.success('Tipo de pago creado correctamente');
      }
      handleCloseForm();
      fetchPaymentTypes();
    } catch (error) {
      console.error('Error saving payment type:', error);
      notify.error('Error al guardar el tipo de pago');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
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
          <h1 className="text-2xl font-bold text-gray-800">Tipos de Pago</h1>
          <p className="text-gray-500">Gestiona los tipos de pago y sus propiedades necesarias</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          Nuevo Tipo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedades</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentTypes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                  No hay tipos de pago configurados.
                </td>
              </tr>
            ) : (
              paymentTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{type.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 space-y-1">
                      {type.properties.map((property, index) => (
                        <div key={index} className="inline-block mr-2 mb-1 bg-gray-100 px-2 py-1 rounded">
                          {property}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Editar Tipo de Pago' : 'Nuevo Tipo de Pago'}
              </h2>
              <button onClick={handleCloseForm} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Tipo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                {formData.properties.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.properties.map((property, index) => (
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
                )}
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
                    editingId ? 'Actualizar' : 'Crear Tipo'
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

export default PaymentTypes;

import { useState, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Settings2,
  AlertCircle,
  CheckCircle2
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
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tipos de Pago</h1>
          <p className="text-sm text-gray-500 mt-1 italic">Gestiona los tipos de pago y sus propiedades necesarias</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-emerald-100 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Tipo</span>
        </button>
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
                        {type.properties.map((property, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {property}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(type)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(type.id)}
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
                      onClick={() => handleEdit(type)}
                      className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="p-2 text-red-600 bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {type.properties.map((property, index) => (
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseForm}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {editingId ? 'Editar Tipo' : 'Nuevo Tipo'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Define las propiedades de este tipo de pago.</p>
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
                      Nombre del Tipo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Pago Móvil, Zelle"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>

                  {/* Sección de Propiedades */}
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
                        className="px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      {formData.properties.length > 0 ? (
                        formData.properties.map((property, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-200">
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
                    onClick={handleCloseForm}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-[2] px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {formLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{editingId ? 'Guardar Cambios' : 'Crear Tipo'}</span>
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

export default PaymentTypes;

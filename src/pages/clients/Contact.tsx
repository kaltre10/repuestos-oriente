import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import useNotify from '../../hooks/useNotify';
import SEO from '../../components/SEO';

const Contact = () => {
  const { notify } = useNotify();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await request.post(`${apiUrl}/contact`, formData);
      notify.success('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error sending contact message:', error);
      notify.error(error.response?.data?.message || 'Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <SEO 
        title="Contacto" 
        description="Ponte en contacto con Repuestos Picha. Estamos para ayudarte a encontrar los mejores repuestos para tu carro en Venezuela."
      />
      <div className="flex items-center gap-3 mb-6">
        <FaEnvelope className="text-red-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Contacto</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600 mb-8">
            Si tienes alguna duda o inconveniente, no dudes en contactarnos. Nuestro equipo te responderá lo antes posible.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <FaPhone />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Teléfono</h4>
                <p className="text-gray-600">+1 234 567 890</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Correo Electrónico</h4>
                <p className="text-gray-600">soporte@marketplace.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Dirección</h4>
                <p className="text-gray-600">Calle Falsa 123, Ciudad, País</p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-gray-50"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-gray-50"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-gray-50"
              placeholder="¿En qué podemos ayudarte?"
            ></textarea>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

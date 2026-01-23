// import React from 'react'; 
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
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

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="¿En qué podemos ayudarte?"
            ></textarea>
          </div>
          <button className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

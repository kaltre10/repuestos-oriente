// import React from 'react';
import { Headset, MessageCircle, FileText, Lock, Mail, Clock } from 'lucide-react';

const CustomerService = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Headset className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Atención al Cliente</h1>
          <p className="text-lg text-gray-600">Canales de comunicación y políticas de servicio</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="p-3 bg-green-50 rounded-2xl text-green-600 w-fit mx-auto mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-500">+58 412-123-4567</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 w-fit mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Email</h3>
            <p className="text-sm text-gray-500">soporte@repuestosoriente.com</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600 w-fit mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Horario</h3>
            <p className="text-sm text-gray-500">Lun-Vie: 8am - 5pm</p>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 rounded-xl text-red-600">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Términos de Servicio</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Al utilizar nuestro sitio web, usted acepta cumplir con nuestros términos y condiciones. Nos reservamos el derecho de actualizar estos términos en cualquier momento para mejorar nuestra calidad de servicio y transparencia.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 rounded-xl text-red-600">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Política de Privacidad</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Su privacidad es nuestra prioridad. Toda la información personal recolectada es utilizada exclusivamente para procesar sus pedidos y mejorar su experiencia de compra, bajo estrictos estándares de seguridad y confidencialidad.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;

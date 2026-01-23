// import React from 'react';
import { Building2, Target, Users, MapPin, Newspaper } from 'lucide-react';

const CompanyInfo = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Building2 className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Información de la Empresa</h1>
          <p className="text-lg text-gray-600">Conoce más sobre Repuestos Oriente y nuestro compromiso</p>
        </div>

        <div className="space-y-12">
          {/* Sobre Nosotros */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 rounded-xl text-red-600">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sobre Nosotros</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Repuestos Oriente es líder en la distribución de autopartes en la región. Con más de 15 años de experiencia, nos dedicamos a ofrecer soluciones integrales para el mantenimiento automotriz, brindando confianza y calidad a cada uno de nuestros clientes.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Misión y Visión */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Nuestra Misión</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Proveer repuestos automotrices de la más alta calidad, garantizando la satisfacción de nuestros clientes mediante un servicio excepcional y asesoría técnica especializada.
              </p>
            </div>

            {/* Blog/Noticias */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Nuestro Blog</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Mantente al día con las últimas tendencias del mundo automotriz, consejos de mantenimiento y guías técnicas preparadas por nuestros expertos.
              </p>
            </div>
          </div>

          {/* Ubicaciones */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 rounded-xl text-red-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Ubicaciones</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Visítanos en nuestras tiendas físicas donde recibirás atención personalizada:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-2 h-2 mt-2 bg-red-600 rounded-full shrink-0"></div>
                <div>
                  <p className="font-bold text-gray-800">Sede Principal</p>
                  <p>Av. Intercomunal, Sector Las Garzas, Barcelona, Anzoátegui.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-2 h-2 mt-2 bg-red-600 rounded-full shrink-0"></div>
                <div>
                  <p className="font-bold text-gray-800">Sucursal Lechería</p>
                  <p>Av. Principal de Lechería, CC. Plaza Mayor, Local 12.</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;

// import React from 'react';

import { Building2, Target, Users, MapPin, Newspaper } from 'lucide-react';
import { socials } from '../../utils/utils';
const CompanyInfo = () => {
  const locations = [
    {
      title: "Sede Principal - Monagas",
      address: "Av. Rivas con Sucre, Maturín, Monagas, Venezuela",
      phone: `+${socials.whatsapp}`,
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d983.0468382781642!2d-63.18219990581234!3d9.75019223877798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c3340b64c367651%3A0xa14dca2631f88973!2sAuto%20Repuestos%20Picha%2C%20C.a!5e0!3m2!1ses-419!2sve!4v1769551742752!5m2!1ses-419!2sve"
    },
  ];



  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Building2 className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Información de la Empresa</h1>
          <p className="text-lg text-gray-600">Conoce más sobre Repuestos Picha y nuestro compromiso</p>
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
              Repuestos Picha es líder en la distribución de autopartes en la región. Con más de 15 años de experiencia, nos dedicamos a ofrecer soluciones integrales para el mantenimiento automotriz, brindando confianza y calidad a cada uno de nuestros clientes.
            </p>
          </section>

          <div className="grid gap-8">
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
            {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Nuestro Blog</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Mantente al día con las últimas tendencias del mundo automotriz, consejos de mantenimiento y guías técnicas preparadas por nuestros expertos.
              </p>
            </div> */}
          </div>

          {/* Ubicaciones */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 rounded-xl text-red-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Nuestras Tiendas</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {locations.map((loc, index) => (
                <div key={index} className="flex flex-col lg:flex-row gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="lg:w-1/2">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{loc.title}</h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        {loc.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        </div>
                        {loc.phone}
                      </p>
                    </div>
                  </div>
                  <div className="lg:w-1/2 h-64 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                    <iframe
                      src={loc.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={loc.title}
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;

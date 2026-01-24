// import React from 'react';
import { Building2, Target, Users, MapPin, Newspaper } from 'lucide-react';

const CompanyInfo = () => {
  const locations = [
    {
      title: "Sede Principal - Caracas",
      address: "Av. Francisco de Miranda, Edificio Galipán, Chacao, Caracas.",
      phone: "+58 212-1234567",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.1812!2d-66.8584!3d10.4910!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a58ad!2sChacao%2C%20Caracas!5e0!3m2!1ses!2sve!4v1706000000000!5m2!1ses!2sve"
    },
    {
      title: "Sucursal Valencia",
      address: "Av. Bolívar Norte, Sector El Viñedo, Valencia, Carabobo.",
      phone: "+58 241-1234567",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.3712!2d-68.0044!3d10.2110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e806!2sValencia!5e0!3m2!1ses!2sve!4v1706000000000!5m2!1ses!2sve"
    },
    {
      title: "Sucursal Puerto La Cruz",
      address: "Av. Municipal, Sector Los Cerezos, Puerto La Cruz, Anzoátegui.",
      phone: "+58 281-1234567",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.1712!2d-64.6244!3d10.2110!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2d7!2sPuerto%20La%20Cruz!5e0!3m2!1ses!2sve!4v1706000000000!5m2!1ses!2sve"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-20">
      <div className="max-w-5xl mx-auto">
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

// import React from 'react';
import { HelpCircle, Truck, RefreshCcw, ShoppingBag, Search, ShieldCheck } from 'lucide-react';

const HelpSupport = () => {
  const sections = [
    {
      title: 'Información de Envío',
      icon: <Truck className="w-8 h-8 text-red-600" />,
      content: 'Realizamos envíos a todo el territorio nacional a través de las principales agencias de encomiendas (MRW, Zoom, Tealca). Los tiempos de entrega varían entre 24 a 72 horas hábiles.'
    },
    {
      title: 'Devoluciones',
      icon: <RefreshCcw className="w-8 h-8 text-red-600" />,
      content: 'Contamos con una política de devolución de 48 horas tras recibir el producto, siempre que este se encuentre en su empaque original y no haya sido instalado.'
    },
    {
      title: 'Cómo Ordenar',
      icon: <ShoppingBag className="w-8 h-8 text-red-600" />,
      content: 'Selecciona tus repuestos, añádelos al carrito, completa tus datos de envío y realiza el pago. ¡Es así de simple!'
    },
    {
      title: 'Cómo Rastrear',
      icon: <Search className="w-8 h-8 text-red-600" />,
      content: 'Una vez despachado tu pedido, recibirás un número de guía para que puedas hacer seguimiento en tiempo real desde la web de la agencia seleccionada.'
    },
    {
      title: 'Garantía de Calidad',
      icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
      content: 'Todos nuestros repuestos están garantizados contra defectos de fábrica. Trabajamos solo con marcas reconocidas y certificadas.'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ayuda y Soporte</h1>
          <p className="text-lg text-gray-600">Estamos aquí para guiarte en cada paso de tu compra</p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-red-50 rounded-2xl shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;

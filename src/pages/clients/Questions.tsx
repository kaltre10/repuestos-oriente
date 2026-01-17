import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const Questions = () => {
  const faqs = [
    {
      question: "¿Cómo realizo una compra?",
      answer: "Para realizar una compra, simplemente selecciona los productos que deseas, añádelos al carrito y sigue los pasos del checkout."
    },
    {
      question: "¿Cuáles son los métodos de pago?",
      answer: "Aceptamos tarjetas de crédito, débito y transferencias bancarias. Puedes gestionar tus métodos de pago en la sección correspondiente."
    },
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de seguimiento y el enlace para rastrearlo."
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <FaQuestionCircle className="text-red-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Preguntas Frecuentes</h1>
      </div>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-50 pb-6 last:border-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;

import React from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { socials } from '../utils/utils';

const WhatsAppButton: React.FC = () => {
  const whatsappNumber = socials.whatsapp; // Número extraído del Footer.tsx
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[20%] md:bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group"
      aria-label="Contactar por WhatsApp"
    >
      <SiWhatsapp size={32} />
      <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none whitespace-nowrap border border-gray-100">
        ¡Contáctanos!
      </span>
    </a>
  );
};

export default WhatsAppButton;

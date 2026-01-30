import { Link } from "react-router-dom";
import {
  SiInstagram,
  SiTiktok,
  SiWhatsapp
} from "react-icons/si";
import { socials } from "../utils/utils";

const _socials = [
  {
    icon: SiInstagram,
    link: socials.instagram
  },
  {
    icon: SiWhatsapp,
    link: `https://api.whatsapp.com/send?phone=${socials.whatsapp}`
  },
  {
    icon: SiTiktok,
    link: socials.tiktok
  }
]



export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 md:px-8 lg:px-16 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Columna 1 - Información principal */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                <span className="text-red-600">REPUESTOS</span>PICHA
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Proporcionamos repuestos automotrices de alta calidad con servicio confiable y soporte al cliente.
              </p>
            </div>

            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">📞</span>
                <span>+(58) {socials.whatsapp}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">📧</span>
                <span>{socials.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">🕘</span>
                <span>Lun–Vie, 8:00–17:00 (VET)</span>
              </li>
            </ul>

            <div className="flex space-x-5">
              {_socials.map(({ icon: Icon, link }) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label={`Visitar ${link.includes('instagram') ? 'Instagram' : link.includes('whatsapp') ? 'WhatsApp' : 'TikTok'}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 - Ayuda y Soporte */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Ayuda y Soporte</h4>
            <ul className="space-y-4">
              <li><Link to="/ayuda-soporte" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Información de Envío</span>
              </Link></li>
              <li><Link to="/ayuda-soporte" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Cómo Ordenar</span>
              </Link></li>
              <li><Link to="/ayuda-soporte" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Cómo Rastrear</span>
              </Link></li>
              <li><Link to="/ayuda-soporte" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Garantía de Calidad</span>
              </Link></li>
            </ul>
          </div>

          {/* Columna 3 - Información de la Empresa */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Información de la Empresa</h4>
            <ul className="space-y-4">
              <li><Link to="/informacion-empresa" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Sobre Nosotros</span>
              </Link></li>
              <li><Link to="/informacion-empresa" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Carreras</span>
              </Link></li>
              <li><Link to="/informacion-empresa" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Ubicaciones</span>
              </Link></li>
              <li><Link to="/informacion-empresa" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Testimonios</span>
              </Link></li>
            </ul>
          </div>

          {/* Columna 4 - Atención al Cliente */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">Atención al Cliente</h4>
            <ul className="space-y-4">
              <li><Link to="/atencion-cliente" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Preguntas Frecuentes</span>
              </Link></li>
              <li><Link to="/atencion-cliente" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Términos de Servicio</span>
              </Link></li>
              <li><Link to="/atencion-cliente" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Política de Privacidad</span>
              </Link></li>
              <li><Link to="/atencion-cliente" className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-2 hover:translate-x-1">
                <span className="text-red-500 opacity-0 hover:opacity-100 transition-opacity">→</span>
                <span>Contáctanos</span>
              </Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 pb-5 md:pb-12 lg:pb-0 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Repuestos Picha. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="/terminos" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Términos</a>
            <a href="/privacidad" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacidad</a>
            <a href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import {
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiWhatsapp
} from "react-icons/si";

const socials = [
  {
    icon: SiInstagram,
    link: "https://www.instagram.com/repuestosoriente/"
  },
  {
    icon: SiFacebook,
    link: "https://www.facebook.com/repuestosoriente/"
  },
  {
    icon: SiYoutube,
    link: "https://www.youtube.com/channel/UCi431n3h3h3h3h3h3h3h3"
  },
  {
    icon: SiWhatsapp,
    link: "https://api.whatsapp.com/send?phone=584121234567"
  }
]



export default function Footer() {
  return (
    <footer className="mb-70px bg-gray-900 text-white text-sm pt-10 pb-6 px-4 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

        {/* Columna 1 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">REPUESTOS ORIENTE</h3>
          <p className="text-gray-400 mb-4">
            Proporcionamos repuestos automotrices de alta calidad con servicio confiable y soporte al cliente.
          </p>

          <ul className="space-y-1 text-gray-400 mb-4">
            <li>📞 +58-412-123-4567</li>
            <li>📧 info@repuestosoriente.com</li>
            <li>🕘 Lun–Vie, 8:00–17:00 (VET)</li>
          </ul>

          <div className="flex space-x-4 text-gray-400">
            {socials.map(({ icon: Icon, link }) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">Ayuda y Soporte</h3>
          <ul className="space-y-2">
            <li><Link to="/ayuda-soporte" className="hover:text-red-500 transition-colors">Información de Envío</Link></li>
            <li><Link to="/ayuda-soporte" className="hover:text-red-500 transition-colors">Devoluciones</Link></li>
            <li><Link to="/ayuda-soporte" className="hover:text-red-500 transition-colors">Cómo Ordenar</Link></li>
            <li><Link to="/ayuda-soporte" className="hover:text-red-500 transition-colors">Cómo Rastrear</Link></li>
            <li><Link to="/ayuda-soporte" className="hover:text-red-500 transition-colors">Garantía de Calidad</Link></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">Información de la Empresa</h3>
          <ul className="space-y-2">
            <li><Link to="/informacion-empresa" className="hover:text-red-500 transition-colors">Sobre Nosotros</Link></li>
            <li><Link to="/informacion-empresa" className="hover:text-red-500 transition-colors">Nuestro Blog</Link></li>
            <li><Link to="/informacion-empresa" className="hover:text-red-500 transition-colors">Carreras</Link></li>
            <li><Link to="/informacion-empresa" className="hover:text-red-500 transition-colors">Ubicaciones</Link></li>
            <li><Link to="/informacion-empresa" className="hover:text-red-500 transition-colors">Testimonios</Link></li>
          </ul>
        </div>

        {/* Columna 4 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">Atención al Cliente</h3>
          <ul className="space-y-2">
            <li><Link to="/atencion-cliente" className="hover:text-red-500 transition-colors">Preguntas Frecuentes</Link></li>
            <li><Link to="/atencion-cliente" className="hover:text-red-500 transition-colors">Términos de Servicio</Link></li>
            <li><Link to="/atencion-cliente" className="hover:text-red-500 transition-colors">Política de Privacidad</Link></li>
            <li><Link to="/atencion-cliente" className="hover:text-red-500 transition-colors">Contáctanos</Link></li>
            <li><Link to="/atencion-cliente" className="hover:text-red-500 transition-colors">Tarjeta de Regalo</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-400">
        <p>© 2025 Repuestos Oriente. Todos los derechos reservados.</p>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span>🌐 Español</span>
          <span>💲 VES</span>
        </div>
      </div>
    </footer>
  );
}

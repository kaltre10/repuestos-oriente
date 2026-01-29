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
    <footer className="mb-70px bg-gray-900 text-white text-sm pt-10 pb-6 px-4 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

        {/* Columna 1 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">REPUESTOS PICHA</h3>
          <p className="text-gray-400 mb-4">
            Proporcionamos repuestos automotrices de alta calidad con servicio confiable y soporte al cliente.
          </p>

          <ul className="space-y-1 text-gray-400 mb-4">
            <li>📞 +{socials.whatsapp}</li>
            <li>📧 {socials.email}</li>
            <li>🕘 Lun–Vie, 8:00–17:00 (VET)</li>
          </ul>

          <div className="flex space-x-4 text-gray-400">
            {_socials.map(({ icon: Icon, link }) => (
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
            {/* <li><Link to="/ayuda-soporte" className="hover:text-red-500 transition-colors">Devoluciones</Link></li> */}
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
            {/* <li><Link to="/informacion-empresa" className="hover:text-red-500 transition-colors">Nuestro Blog</Link></li> */}
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

      <div className="border-t border-gray-700 pt-4 flex justify-center text-gray-400">
        <p>© 2025 Repuestos Picha. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

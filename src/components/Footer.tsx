import {
  SiInstagram,
  SiFacebook,
  SiYoutube,
  SiWhatsapp
} from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-sm pt-10 pb-6 px-4 md:px-20">
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
            <SiWhatsapp className="hover:text-white cursor-pointer" size={20} />
            <SiInstagram className="hover:text-white cursor-pointer" size={20} />
            <SiFacebook className="hover:text-white cursor-pointer" size={20} />
            <SiYoutube className="hover:text-white cursor-pointer" size={20} />
          </div>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">Ayuda y Soporte</h3>
          <ul className="space-y-2">
            <li>Información de Envío</li>
            <li>Devoluciones</li>
            <li>Cómo Ordenar</li>
            <li>Cómo Rastrear</li>
            <li>Guía de Tallas</li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">Información de la Empresa</h3>
          <ul className="space-y-2">
            <li>Sobre Nosotros</li>
            <li>Nuestro Blog</li>
            <li>Carreras</li>
            <li>Ubicaciones de Tiendas</li>
            <li>Testimonios</li>
          </ul>
        </div>

        {/* Columna 4 */}
        <div>
          <h3 className="text-red-600 uppercase font-semibold mb-4">Atención al Cliente</h3>
          <ul className="space-y-2">
            <li>Preguntas Frecuentes</li>
            <li>Términos de Servicio</li>
            <li>Política de Privacidad</li>
            <li>Contáctanos</li>
            <li>Tarjeta de Regalo</li>
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

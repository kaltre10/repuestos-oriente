import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import ClientSidebar from "../../components/ClientSidebar"
import { FaBars } from 'react-icons/fa'
import Guard from "../../components/Guard"
/* import AdvertisingModal from '../../components/AdvertisingModal'; */
const ClientLayout = () => {
  useEffect(() => {
    document.title = "Área de Clientes | Repuestos Picha";
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (<Guard allow={['admin', 'client']} >
    {/* <AdvertisingModal /> */}
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClientSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header for Area Clientes */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaBars size={24} />
            </button>
            <h1 className="font-black text-xl text-gray-900 tracking-tight">
              Área de <span className="text-red-600">Clientes</span>
            </h1>
          </div>
        </header>

        <main className="overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  </Guard>
  )
}

export default ClientLayout
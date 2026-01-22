import { useState } from "react"
import { Outlet } from "react-router-dom"
import ClientSidebar from "../../components/ClientSidebar"
import { FaBars } from 'react-icons/fa'

const ClientLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
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

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto pb-20 lg:pb-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ClientLayout
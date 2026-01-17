import { Outlet } from "react-router-dom"
import ClientSidebar from "../../components/ClientSidebar"

const ClientLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default ClientLayout
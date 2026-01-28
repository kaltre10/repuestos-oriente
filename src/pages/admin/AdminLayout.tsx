import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Guard from '../../components/Guard';

const AdminLayout = () => {
  useEffect(() => {
    document.title = "Administrativo | Repuestos Picha";
  }, []);

  return (<Guard allow={['admin']} >
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  </Guard>
  );
};

export default AdminLayout;

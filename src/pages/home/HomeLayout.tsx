


import { Outlet } from "react-router-dom";
import HeaderNew from "../../components/HeaderNew";
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from "../../components/Footer";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MobileBottomNav />
      <HeaderNew />
      <main className="flex-grow pt-[120px] md:pt-[180px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
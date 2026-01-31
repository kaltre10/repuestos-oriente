


import { Outlet } from "react-router-dom";
import HeaderNew from "../../components/HeaderNew";
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from "../../components/Footer";

const HomeLayout = () => {
  return (
    <div className="">
      <MobileBottomNav />
      <HeaderNew />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
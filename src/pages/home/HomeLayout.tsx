import Footer from "../../components/Footer";

import HeaderNew from "../../components/HeaderNew";
import { Outlet } from "react-router-dom";
import MobileBottomNav from '../../components/MobileBottomNav';

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
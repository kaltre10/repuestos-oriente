import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import MobileBottomNav from '../../components/MobileBottomNav';

const HomeLayout = () => {
  return (
    <div className="">
      <MobileBottomNav />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
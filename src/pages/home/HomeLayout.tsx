import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
const HomeLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
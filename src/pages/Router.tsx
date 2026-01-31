import { Routes, Route } from "react-router-dom"
import HomePage from "./home/HomePage"
import HelpSupport from "./home/HelpSupport"
import CompanyInfo from "./home/CompanyInfo"
import CustomerService from "./home/CustomerService"
import CheckoutPage from "./home/CheckoutPage"
import PaymentPage from "./home/PaymentPage"
import ProductsPage from "./home/ProductsPage"
import OffersPage from "./home/OffersPage"
import ProductDetailPage from "./home/ProductDetailPage"
import AuthPage from "./AuthPage"
import ResetPasswordPage from "./ResetPasswordPage"
import ClientsPage from "./clients/ClientsPage"
import AdminLayout from './admin/AdminLayout';
import HomeLayout from './home/HomeLayout';
import ClientLayout from "./clients/ClientLayout"
import Profile from "./clients/Profile"
import Purchases from "./clients/Purchases"
import Payments from "./clients/Payments"
import Questions from "./clients/Questions"
import Contact from "./clients/Contact"
import Dashboard from "./admin/Dashboard"

import Users from "./admin/Users"
import Sales from "./admin/Sales"
import Products from "./admin/Products"
import Configurations from "./admin/Configurations"
import ClientQuestions from "./admin/ClientQuestions"
import PaymentMethods from "./admin/PaymentMethods"
import Sliders from "./admin/Sliders"
import Advertising from "./admin/Advertising"
import Test from './test'

const Router = () => {
    return (
        <Routes>
            <Route element={<HomeLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/producto/:id" element={<ProductDetailPage />} />
                <Route path="/ofertas" element={<OffersPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/ayuda-soporte" element={<HelpSupport />} />
                <Route path="/informacion-empresa" element={<CompanyInfo />} />
                <Route path="/atencion-cliente" element={<CustomerService />} />
            </Route>

            <Route element={<ClientLayout />}>
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/profile" element={<Profile />} />
                <Route path="/clients/purchases" element={<Purchases />} />
                <Route path="/clients/payments" element={<Payments />} />
                <Route path="/clients/questions" element={<Questions />} />
                <Route path="/clients/contact" element={<Contact />} />
            </Route>

            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/sliders" element={<Sliders />} />
                <Route path="/admin/advertising" element={<Advertising />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/sales" element={<Sales />} />
                <Route path="/admin/client-questions" element={<ClientQuestions />} />
                <Route path="/admin/payment-methods" element={<PaymentMethods />} />
                <Route path="/admin/configurations" element={<Configurations />} />
            </Route>
            <Route path='/test' element={<Test />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
    );
};

export default Router

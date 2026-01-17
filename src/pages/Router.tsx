import { Routes, Route } from "react-router-dom"
import HomePage from "./home/HomePage"
import CheckoutPage from "./home/CheckoutPage"
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

import Users from "./admin/Users"
import Sales from "./admin/Sales"
import Products from "./admin/Products"
import Configurations from "./admin/Configurations"

const Router = () => {
    return (
        <Routes>
            <Route element={<HomeLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/producto/:id" element={<ProductDetailPage />} />
                <Route path="/ofertas" element={<OffersPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
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
                <Route path="/admin" element={<Users />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/sales" element={<Sales />} />
                <Route path="/admin/configurations" element={<Configurations />} />
            </Route>

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
    );
};

export default Router

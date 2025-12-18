import { Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import Test from "./Test"
import CheckoutPage from "./CheckoutPage"
import ProductsPage from "./ProductsPage"
import OffersPage from "./OffersPage"
import ProductDetailPage from "./ProductDetailPage"

const Router = () => {
    return <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route path="/ofertas" element={<OffersPage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
}

export default Router

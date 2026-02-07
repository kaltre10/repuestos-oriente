import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = express.Router();
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

router.post('/products', [validateToken, onlyAdmin], createProduct);
router.put('/products/:id', [validateToken, onlyAdmin], updateProduct);
router.delete('/products/:id', [validateToken, onlyAdmin], deleteProduct);

export default router;

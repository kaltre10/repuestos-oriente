import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import validateToken from "../midelwares/validateToken.js";

const router = express.Router();
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

router.post('/products',validateToken, createProduct);
router.put('/products/:id',validateToken, updateProduct);
router.delete('/products/:id',validateToken, deleteProduct);

export default router;

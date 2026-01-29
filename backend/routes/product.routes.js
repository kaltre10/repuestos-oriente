import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import validateToken from '../midelwares/validateToken.js';

const router = express.Router();
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.use(validateToken);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;

import express from 'express';
import { getBrands, getBrand, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller.js';
import responser from '../controllers/responser.js';
import validateToken from '../midelwares/validateToken.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Brand API is working' });
});
router.get('/brands', getBrands);
router.get('/brands/:id', getBrand);
router.use(validateToken);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

export default router;

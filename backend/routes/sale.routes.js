import express from 'express';
import { getSales, getSale, createSale, updateSale, deleteSale } from '../controllers/sale.controller.js';
import responser from '../controllers/responser.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Sale API is working' });
});

router.get('/sales', getSales);
router.get('/sales/:id', getSale);
router.post('/sales', createSale);
router.put('/sales/:id', updateSale);
router.delete('/sales/:id', deleteSale);

export default router;

import express from 'express';
import { getSales, getSale, getSalesByUserId, createSale, updateSale, deleteSale, createCheckout } from '../controllers/sale.controller.js';
import responser from '../controllers/responser.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Sale API is working' });
});

router.get('/sales', getSales);
router.get('/sales/user/:userId', getSalesByUserId);
router.get('/sales/:id', getSale);
router.post('/sales', createSale);
router.post('/checkout', createCheckout);
router.put('/sales/:id', updateSale);
router.delete('/sales/:id', deleteSale);

export default router;

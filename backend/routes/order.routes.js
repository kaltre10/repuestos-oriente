import express from 'express';
import { getOrders, getOrder, getOrdersByBuyerId, createOrder, updateOrder, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.get('/buyer/:buyerId', getOrdersByBuyerId);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;

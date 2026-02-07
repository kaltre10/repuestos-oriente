import express from 'express';
import { getOrders, getOrder, getOrdersByBuyerId, createOrder, updateOrder, deleteOrder } from '../controllers/order.controller.js';
import validateToken from "../midelwares/validateToken.js";
import { validateOrderIntegrity } from '../midelwares/validateOrderIntegrity.js';

const router = express.Router();

router.get('/', validateToken, getOrders);
router.get('/:id', validateToken, getOrder);
router.get('/buyer/:buyerId', validateToken, getOrdersByBuyerId);

router.post('/', validateOrderIntegrity, validateToken, createOrder);
router.put('/:id',validateToken, updateOrder);
router.delete('/:id',validateToken, deleteOrder);

export default router;

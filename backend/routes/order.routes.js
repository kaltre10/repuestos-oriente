import express from 'express';
import { getOrders, getOrder, getOrdersByBuyerId, createOrder, updateOrder, deleteOrder } from '../controllers/order.controller.js';
import validateToken from "../midelwares/validateToken.js";

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.get('/buyer/:buyerId', getOrdersByBuyerId);
router.post('/',validateToken, createOrder);
router.put('/:id',validateToken, updateOrder);
router.delete('/:id',validateToken, deleteOrder);

export default router;

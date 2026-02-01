import express from 'express';
import { getOrders, getOrder, getOrdersByBuyerId, createOrder, updateOrder, deleteOrder } from '../controllers/order.controller.js';
<<<<<<< HEAD
import validateToken from "../midelwares/validateToken.js";
=======
import { validateOrderIntegrity } from '../midelwares/validateOrderIntegrity.js';
>>>>>>> f734c489f663a66104ada068085b7bfab9806ee1

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.get('/buyer/:buyerId', getOrdersByBuyerId);
<<<<<<< HEAD
router.post('/',validateToken, createOrder);
router.put('/:id',validateToken, updateOrder);
router.delete('/:id',validateToken, deleteOrder);
=======
router.post('/', validateOrderIntegrity, createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
>>>>>>> f734c489f663a66104ada068085b7bfab9806ee1

export default router;

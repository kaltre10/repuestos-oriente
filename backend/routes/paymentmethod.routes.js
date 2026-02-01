import express from 'express';
import paymentMethodController from '../controllers/methods.controller.js';
import validateToken from "../midelwares/validateToken.js";

const router = express.Router();

router.get('/', paymentMethodController.getPaymentMethods);
router.get('/:id', paymentMethodController.getPaymentMethod);

router.post('/',validateToken, paymentMethodController.createPaymentMethod);
router.put('/:id',validateToken, paymentMethodController.updatePaymentMethod);
router.delete('/:id',validateToken, paymentMethodController.deletePaymentMethod);

export default router;

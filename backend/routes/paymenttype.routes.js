import express from 'express';
import paymentTypeController from '../controllers/paymenttypes.controller.js';

const router = express.Router();

router.get('/', paymentTypeController.getPaymentTypes);
router.get('/:id', paymentTypeController.getPaymentType);
router.post('/', paymentTypeController.createPaymentType);
router.put('/:id', paymentTypeController.updatePaymentType);
router.delete('/:id', paymentTypeController.deletePaymentType);

export default router;

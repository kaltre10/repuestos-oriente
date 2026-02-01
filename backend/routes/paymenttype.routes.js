import express from 'express';
import paymentTypeController from '../controllers/paymenttypes.controller.js';
import validateToken from "../midelwares/validateToken.js";

const router = express.Router();

router.get('/', paymentTypeController.getPaymentTypes);
router.get('/:id', paymentTypeController.getPaymentType);
router.post('/',validateToken, paymentTypeController.createPaymentType);
router.put('/:id',validateToken, paymentTypeController.updatePaymentType);
router.delete('/:id',validateToken, paymentTypeController.deletePaymentType);

export default router;

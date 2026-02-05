import express from 'express';
import paymentTypeController from '../controllers/paymenttypes.controller.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = express.Router();

router.get('/', paymentTypeController.getPaymentTypes);
router.get('/:id', paymentTypeController.getPaymentType);
router.post('/', [validateToken, onlyAdmin], paymentTypeController.createPaymentType);
router.put('/:id', [validateToken, onlyAdmin], paymentTypeController.updatePaymentType);
router.delete('/:id', [validateToken, onlyAdmin], paymentTypeController.deletePaymentType);

export default router;

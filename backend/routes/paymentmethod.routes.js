import express from 'express';
import paymentMethodController from '../controllers/methods.controller.js';
/* import validateToken from '../midelwares/validateToken.js'; */
import onlyAdmin from '../midelwares/onlyAdmin.js';

const router = express.Router();

router.get('/', paymentMethodController.getPaymentMethods);
router.get('/:id', paymentMethodController.getPaymentMethod);
router.use(onlyAdmin);

router.post('/', paymentMethodController.createPaymentMethod);
router.put('/:id', paymentMethodController.updatePaymentMethod);
router.delete('/:id', paymentMethodController.deletePaymentMethod);

export default router;

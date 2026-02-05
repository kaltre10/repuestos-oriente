import express from 'express';
import { uploadReceipt, getSales, getSale, getSalesByUserId, createSale, updateSale, deleteSale, createCheckout, getStats } from '../controllers/sale.controller.js';
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";
import { validateOrderIntegrity } from '../midelwares/validateOrderIntegrity.js';
const router = express.Router();

router.get('/', [validateToken, onlyAdmin], getSales);
router.get('/stats', [validateToken, onlyAdmin], getStats);
router.get('/user/:userId', validateToken, getSalesByUserId);
router.get('/:id', validateToken, getSale);
router.delete('/:id', [validateToken, onlyAdmin], deleteSale);
router.put('/:id', [validateToken, onlyAdmin], updateSale);

router.post('/checkout', validateToken, uploadMidelware.single('receiptImage'), createCheckout);
router.post('/upload-receipt', validateToken, uploadMidelware.single('receiptImage'), uploadReceipt);
router.post('/', [validateToken, validateOrderIntegrity], createSale);




export default router;

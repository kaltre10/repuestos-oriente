import express from 'express';
import { uploadReceipt, getSales, getSale, getSalesByUserId, createSale, updateSale, deleteSale, createCheckout, getStats } from '../controllers/sale.controller.js';
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
import validateToken from '../midelwares/validateToken.js';

const router = express.Router();

router.get('/', getSales);
router.get('/stats', getStats);
router.get('/user/:userId', getSalesByUserId);
router.get('/:id', getSale);

/* router.use(validateToken); */

router.post('/', createSale);
router.post('/checkout', uploadMidelware.single('receiptImage'), createCheckout);
router.post('/upload-receipt', uploadMidelware.single('receiptImage'), uploadReceipt);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

export default router;

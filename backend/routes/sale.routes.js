import express from 'express';
import { uploadReceipt, getSales, getSale, getSalesByUserId, createSale, updateSale, deleteSale, createCheckout, getStats } from '../controllers/sale.controller.js';
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
<<<<<<< HEAD
import validateToken from "../midelwares/validateToken.js";
=======
import { validateOrderIntegrity } from '../midelwares/validateOrderIntegrity.js';

>>>>>>> f734c489f663a66104ada068085b7bfab9806ee1
const router = express.Router();

router.get('/', getSales);
router.get('/stats', getStats);
router.get('/user/:userId', getSalesByUserId);
router.get('/:id', getSale);

<<<<<<< HEAD
router.post('/',validateToken, createSale);
router.post('/checkout', validateToken, uploadMidelware.single('receiptImage'), createCheckout);
router.post('/upload-receipt', validateToken, uploadMidelware.single('receiptImage'), uploadReceipt);
router.put('/:id', validateToken, updateSale);
router.delete('/:id', validateToken, deleteSale);
=======
router.post('/', validateOrderIntegrity, createSale);
router.post('/checkout', uploadMidelware.single('receiptImage'), validateOrderIntegrity, createCheckout);
router.post('/upload-receipt', uploadMidelware.single('receiptImage'), uploadReceipt);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);
>>>>>>> f734c489f663a66104ada068085b7bfab9806ee1

export default router;

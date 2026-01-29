import { Router } from 'express';
import advertisingController from '../controllers/advertising.controller.js';

const router = Router();

router.get("/", advertisingController.getAdvertising)
router.get('/:id', advertisingController.getAdvertisingById)
router.get('/active', advertisingController.getActiveAdvertising)

router.post("/", advertisingController.createAdvertising)
router.put('/:id', advertisingController.updateAdvertising)
router.delete('/:id', advertisingController.deleteAdvertising)

export default router;
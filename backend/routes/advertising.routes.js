import { Router } from 'express';
import advertisingController from '../controllers/advertising.controller.js';
import validateToken from '../midelwares/validateToken.js';
const router = Router();    

router.get("/", advertisingController.getAdvertising)
router.get('/active', advertisingController.getActiveAdvertising)
router.get('/:id', advertisingController.getAdvertisingById)

router.post("/", validateToken, advertisingController.createAdvertising)
router.put('/:id', validateToken, advertisingController.updateAdvertising)
router.delete('/:id', validateToken, advertisingController.deleteAdvertising)

export default router;
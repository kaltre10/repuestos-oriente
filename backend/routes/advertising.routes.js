import { Router } from 'express';
import advertisingController from '../controllers/advertising.controller.js';
import validateToken from '../midelwares/validateToken.js';
import onlyAdmin from '../midelwares/onlyAdmin.js';
const router = Router();    

router.get("/", advertisingController.getAdvertising)
router.get('/active', advertisingController.getActiveAdvertising)
router.get('/:id', advertisingController.getAdvertisingById)

router.post("/", [validateToken, onlyAdmin], advertisingController.createAdvertising)
router.put('/:id', [validateToken, onlyAdmin], advertisingController.updateAdvertising)
router.delete('/:id', [validateToken, onlyAdmin], advertisingController.deleteAdvertising)

export default router;
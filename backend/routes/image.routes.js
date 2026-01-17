import { Router } from 'express';
import ImageController from '../controllers/image.controller.js';
const { upload, deleteImage, getByProduct } = ImageController;
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
import validateToken from '../midelwares/validateToken.js';

const router = Router();

router.post('/images/upload', validateToken, uploadMidelware.array('images', 5), upload);
router.delete('/images/:id', validateToken, deleteImage);
router.get('/images/product/:productId', getByProduct);

export default router;

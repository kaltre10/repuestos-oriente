import { Router } from 'express';
import ImageController from '../controllers/image.controller.js';
const { upload, deleteImage, getByProduct } = ImageController;
import { uploadMidelware } from '../midelwares/uploadMidelware.js';

const router = Router();
router.get('/images/product/:productId', getByProduct);

router.post('/images/upload', uploadMidelware.array('images', 5), upload);
router.delete('/images/:id', deleteImage);

export default router;

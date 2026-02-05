import { Router } from 'express';
import ImageController from '../controllers/image.controller.js';
const { upload, deleteImage, getByProduct } = ImageController;
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = Router();
router.get('/images/product/:productId', getByProduct);

router.post('/images/upload', [validateToken, onlyAdmin], uploadMidelware.array('images', 5), upload);
router.delete('/images/:id', [validateToken, onlyAdmin], deleteImage);

export default router;

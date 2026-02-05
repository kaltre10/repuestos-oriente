import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = Router();

router.get("/",sliderController.getSliders)
router.get('/:id',sliderController.getSliderById)

router.post('/', [validateToken, onlyAdmin], uploadMidelware.single('image'), sliderController.createSlider);
router.put('/:id', [validateToken, onlyAdmin], uploadMidelware.single('image'), sliderController.updateSlider)
router.delete('/:id', [validateToken, onlyAdmin], sliderController.deleteSlider);

export default router;

import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';
import { uploadMidelware } from '../midelwares/uploadMidelware.js';
import validateToken from "../midelwares/validateToken.js";

const router = Router();

router.get("/",sliderController.getSliders)
router.get('/:id',sliderController.getSliderById)

router.post('/', uploadMidelware.single('image'), validateToken, sliderController.createSlider);
router.put('/:id', uploadMidelware.single('image'), validateToken, sliderController.updateSlider)
router.delete('/:id',sliderController.deleteSlider, validateToken, sliderController.deleteSlider);

export default router;

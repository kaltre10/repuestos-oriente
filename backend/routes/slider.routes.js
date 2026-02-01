import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';
import { uploadMidelware } from '../midelwares/uploadMidelware.js';

const router = Router();

router.get("/",sliderController.getSliders)
router.get('/:id',sliderController.getSliderById)

router.post('/', uploadMidelware.single('image'), sliderController.createSlider);
router.put('/:id', uploadMidelware.single('image'), sliderController.updateSlider)
router.delete('/:id', sliderController.deleteSlider);

export default router;

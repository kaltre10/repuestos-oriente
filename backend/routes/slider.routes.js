import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';

const router = Router();

router.get("/",sliderController.getSliders)
router.get('/:id',sliderController.getSliderById)

router.post('/',sliderController.createSlider);
router.put('/:id', sliderController.updateSlider)
router.delete('/:id', sliderController.deleteSlider);

export default router;

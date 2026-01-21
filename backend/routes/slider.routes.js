import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';

const router = Router();

router.route('/')
  .get(sliderController.getSliders)
  .post(sliderController.createSlider);

router.route('/:id')
  .get(sliderController.getSliderById)
  .put(sliderController.updateSlider)
  .delete(sliderController.deleteSlider);

export default router;

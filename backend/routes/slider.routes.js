import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';
import validateToken from '../midelwares/validateToken.js';

const router = Router();

router.get("/",sliderController.getSliders)
router.get('/:id',sliderController.getSliderById)
router.use(validateToken);
router.post('/',sliderController.createSlider);
router.put('/:id', sliderController.updateSlider)
router.delete('/:id', sliderController.deleteSlider);

export default router;

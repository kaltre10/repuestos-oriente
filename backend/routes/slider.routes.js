import { Router } from 'express';
import sliderController from '../controllers/slider.controller.js';
import validateToken from "../midelwares/validateToken.js";

const router = Router();

router.get("/",sliderController.getSliders)
router.get('/:id',sliderController.getSliderById)

router.post('/',validateToken, sliderController.createSlider);
router.put('/:id', validateToken, sliderController.updateSlider)
router.delete('/:id', validateToken, sliderController.deleteSlider);

export default router;

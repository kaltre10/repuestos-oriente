import sliderService from '../services/slider.service.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getSliders = asyncHandler(async (req, res) => {
  const sliders = await sliderService.getAllSliders();
  console.log(sliders)
  return responser.success({
    res,
    body: { sliders },
  });
});

const getSliderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slider = await sliderService.getSliderById(id);
  return responser.success({
    res,
    body: { slider },
  });
});

const createSlider = asyncHandler(async (req, res) => {
  const { title, description1, description2, buttonText, buttonLink, image, status } = req.body;
  const slider = await sliderService.createSlider({
    title,
    description1,
    description2,
    buttonText,
    buttonLink,
    image,
    status,
  });
  return responser.success({
    res,
    body: { slider },
    status: 201,
  });
});

const updateSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description1, description2, buttonText, buttonLink, image, status } = req.body;
  const slider = await sliderService.updateSlider(id, {
    title,
    description1,
    description2,
    buttonText,
    buttonLink,
    image,
    status,
  });
  return responser.success({
    res,
    body: { slider },
  });
});

const deleteSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await sliderService.deleteSlider(id);
  return responser.success({
    res,
    message: result.message,
  });
});

export default {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
};

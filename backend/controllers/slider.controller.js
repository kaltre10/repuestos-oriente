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
  if (!req.file) {
    return responser.error({
      res,
      message: 'No se subió ninguna imagen',
      status: 400,
    });
  }

  const { title, description, link } = req.body;
  const image = `${req.file.filename}`;

  const newSlider = await sliderService.createSlider({ title, description, image, link });
  responser.success({
    res,
    message: 'Slider creado con éxito',
    body: { slider: newSlider },
  });
});

const updateSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, link, status } = req.body;
  let image;

  if (req.file) {
    image = `${req.file.filename}`;
  }

  const updatedSlider = await sliderService.updateSlider(id, { title, description, image, link, status });
  responser.success({
    res,
    message: 'Slider actualizado con éxito',
    body: { slider: updatedSlider },
  });
});

const deleteSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await sliderService.deleteSlider(id);
  responser.success({
    res,
    message: 'Slider eliminado con éxito',
  });
});

export default {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
};

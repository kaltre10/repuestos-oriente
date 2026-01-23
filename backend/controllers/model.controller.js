import modelService from '../services/model.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getModels = asyncHandler(async (req, res) => {
  const models = await modelService.getAllModels();
  responser.success({
    res,
    body: { models },
  });
});

const getModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const model = await modelService.getModelById(id);
  responser.success({
    res,
    body: { model },
  });
});

const createModel = asyncHandler(async (req, res) => {
  const { model, brandId } = req.body;

  if (!model || !brandId) {
    return responser.error({
      res,
      message: 'El nombre del modelo y el ID de la marca son requeridos',
      status: 400,
    });
  }

  const newModel = await modelService.createModel({ model, brandId });
  responser.success({
    res,
    message: 'Modelo creado con éxito',
    body: { model: newModel },
  });
});

const updateModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { model, brandId } = req.body;

  if (!model || !brandId) {
    return responser.error({
      res,
      message: 'El nombre del modelo y el ID de la marca son requeridos',
      status: 400,
    });
  }

  const updatedModel = await modelService.updateModel(id, { model, brandId });
  responser.success({
    res,
    message: 'Modelo actualizado con éxito',
    body: { model: updatedModel },
  });
});

const deleteModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await modelService.deleteModel(id);
  responser.success({
    res,
    message: result.message,
  });
});

export {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel
};

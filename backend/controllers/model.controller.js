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
      message: 'Model name and brandId are required',
      status: 400,
    });
  }

  const newModel = await modelService.createModel({ model, brandId });
  responser.success({
    res,
    message: 'Model created successfully',
    body: { model: newModel },
  });
});

const updateModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { model, brandId } = req.body;

  if (!model || !brandId) {
    return responser.error({
      res,
      message: 'Model name and brandId are required',
      status: 400,
    });
  }

  const updatedModel = await modelService.updateModel(id, { model, brandId });
  responser.success({
    res,
    message: 'Model updated successfully',
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

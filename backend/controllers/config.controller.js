import configService from '../services/config.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getConfigs = asyncHandler(async (req, res) => {
  const configs = await configService.getAllConfigs();
  responser.success({
    res,
    body: { configs },
  });
});

const getConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const config = await configService.getConfigById(id);
  responser.success({
    res,
    body: { config },
  });
});

const createConfig = asyncHandler(async (req, res) => {
  const { dolarRate } = req.body;

  if (!dolarRate || dolarRate <= 0) {
    return responser.error({
      res,
      message: 'La tasa del dólar es requerida y debe ser mayor a 0',
      status: 400,
    });
  }

  const newConfig = await configService.createConfig({ dolarRate });
  responser.success({
    res,
    message: 'Configuración creada con éxito',
    body: { config: newConfig },
  });
});

const updateConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dolarRate } = req.body;

  if (dolarRate !== undefined && dolarRate <= 0) {
    return responser.error({
      res,
      message: 'La tasa del dólar debe ser mayor a 0',
      status: 400,
    });
  }

  const updatedConfig = await configService.updateConfig(id, { dolarRate });
  responser.success({
    res,
    message: 'Configuración actualizada con éxito',
    body: { config: updatedConfig },
  });
});

const deleteConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await configService.deleteConfig(id);
  responser.success({
    res,
    message: result.message,
  });
});

export {
  getConfigs,
  getConfig,
  createConfig,
  updateConfig,
  deleteConfig
};

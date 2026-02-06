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
  const { dolarRate, freeShippingThreshold, shippingPrice } = req.body;

  if (!dolarRate || dolarRate <= 0) {
    return responser.error({
      res,
      message: 'La tasa del dólar es requerida y debe ser mayor a 0',
      status: 400,
    });
  }

  // Validate freeShippingThreshold and shippingPrice if provided
  if (freeShippingThreshold !== undefined && freeShippingThreshold < 0) {
    return responser.error({
      res,
      message: 'El umbral de envío gratis debe ser mayor o igual a 0',
      status: 400,
    });
  }

  if (shippingPrice !== undefined && shippingPrice < 0) {
    return responser.error({
      res,
      message: 'El precio de envío debe ser mayor o igual a 0',
      status: 400,
    });
  }

  const newConfig = await configService.createConfig({
    dolarRate,
    freeShippingThreshold: freeShippingThreshold || 0, // Default to 0 if not provided
    shippingPrice: shippingPrice || 0 // Default to 0 if not provided
  });
  responser.success({
    res,
    message: 'Configuración creada con éxito',
    body: { config: newConfig },
  });
});

const updateConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dolarRate, freeShippingThreshold, shippingPrice } = req.body;

  // Create update data object
  const updateData = {};

  // Only add fields to update if they are provided
  if (dolarRate !== undefined) {
    if (dolarRate <= 0) {
      return responser.error({
        res,
        message: 'La tasa del dólar debe ser mayor a 0',
        status: 400,
      });
    }
    updateData.dolarRate = dolarRate;
  }

  if (freeShippingThreshold !== undefined) {
    if (freeShippingThreshold < 0) {
      return responser.error({
        res,
        message: 'El umbral de envío gratis debe ser mayor o igual a 0',
        status: 400,
      });
    }
    updateData.freeShippingThreshold = freeShippingThreshold;
  }

  if (shippingPrice !== undefined) {
    if (shippingPrice < 0) {
      return responser.error({
        res,
        message: 'El precio de envío debe ser mayor o igual a 0',
        status: 400,
      });
    }
    updateData.shippingPrice = shippingPrice;
  }

  const updatedConfig = await configService.updateConfig(id, updateData);
  responser.success({
    res,
    message: 'Configuración actualizada con éxito',
    body: { config: updatedConfig },
  });
});

const updateDolarFromBCV = asyncHandler(async (req, res) => {
  const updatedConfig = await configService.updateDolarRateFromBCV();
  responser.success({
    res,
    message: 'Tasa del dólar actualizada desde el BCV con éxito',
    body: { config: updatedConfig },
  });
});

const deleteConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await configService.deleteConfig(id);
  responser.success({
    res,
    message: 'Configuración eliminada con éxito',
  });
});

export {
  getConfigs,
  getConfig,
  createConfig,
  updateConfig,
  deleteConfig,
  updateDolarFromBCV,
};

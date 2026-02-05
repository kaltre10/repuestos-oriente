import advertisingService from '../services/advertising.service.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getAdvertising = asyncHandler(async (req, res) => {
  const advertising = await advertisingService.getAllAdvertising();
  return responser.success({
    res,
    body: { advertising },
  });
});

const getActiveAdvertising = asyncHandler(async (req, res) => {
  const advertising = await advertisingService.getActiveAdvertising();
  if (!advertising) {
    return responser.success({
      res,
      body: null,
      message: 'No hay publicidad activa'
    });
  }
  return responser.success({
    res,
    body: advertising,
  });
});

const getAdvertisingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const advertising = await advertisingService.getAdvertisingById(id);
  return responser.success({
    res,
    body: { advertising },
  });
});

const createAdvertising = asyncHandler(async (req, res) => {
  const { image, link, buttonText, status } = req.body;
  const advertising = await advertisingService.createAdvertising({
    image,
    link,
    buttonText,
    status,
  });
  return responser.success({
    res,
    body: { advertising },
    status: 201,
  });
});

const updateAdvertising = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { image, link, buttonText, status } = req.body;
  const advertising = await advertisingService.updateAdvertising(id, {
    image,
    link,
    buttonText,
    status,
  });
  return responser.success({
    res,
    body: { advertising },
  });
});

const deleteAdvertising = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await advertisingService.deleteAdvertising(id);
  return responser.success({
    res,
    message: result.message,
  });
});

export default {
  getAdvertising,
  getActiveAdvertising,
  getAdvertisingById,
  createAdvertising,
  updateAdvertising,
  deleteAdvertising,
};

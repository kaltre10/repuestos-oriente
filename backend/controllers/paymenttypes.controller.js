import paymentTypeService from '../services/paymenttypes.service.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getPaymentTypes = asyncHandler(async (req, res) => {
  const paymentTypes = await paymentTypeService.getAllPaymentTypes();
  responser.success({
    res,
    body: { paymentTypes },
  });
});

const getPaymentType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const paymentType = await paymentTypeService.getPaymentTypeById(id);
  responser.success({
    res,
    body: { paymentType },
  });
});

const createPaymentType = asyncHandler(async (req, res) => {
  const { name, properties } = req.body;

  if (!name) {
    return responser.error({
      res,
      message: 'El nombre del tipo de pago es requerido',
      status: 400,
    });
  }

  // Ensure properties is always an array
  const normalizedProperties = Array.isArray(properties) ? properties : [];

  const paymentType = await paymentTypeService.createPaymentType({
    name,
    properties: normalizedProperties,
  });

  responser.success({
    res,
    body: { paymentType },
    status: 201,
  });
});

const updatePaymentType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
  // Ensure properties is always an array when updating
  if (data.properties) {
    data.properties = Array.isArray(data.properties) ? data.properties : [];
  }

  const paymentType = await paymentTypeService.updatePaymentType(id, data);
  responser.success({
    res,
    body: { paymentType },
  });
});

const deletePaymentType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await paymentTypeService.deletePaymentType(id);
  responser.success({
    res,
    body: result,
  });
});

export default {
  getPaymentTypes,
  getPaymentType,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
};

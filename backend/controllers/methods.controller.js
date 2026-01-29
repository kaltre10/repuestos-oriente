import methodsService from '../services/methods.service.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getPaymentMethods = asyncHandler(async (req, res) => {
  const { onlyActive } = req.query;
  let paymentMethods;
  
  if (onlyActive === 'true') {
    paymentMethods = await methodsService.getActivePaymentMethods();
  } else {
    paymentMethods = await methodsService.getAllPaymentMethods();
  }

  responser.success({
    res,
    body: { paymentMethods },
  });
});

const getPaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const paymentMethod = await methodsService.getPaymentMethodById(id);
  responser.success({
    res,
    body: { paymentMethod },
  });
});

const createPaymentMethod = asyncHandler(async (req, res) => {
  const { name, paymentTypeId, properties, isActive } = req.body;

  if (!paymentTypeId) {
    return responser.error({
      res,
      message: 'El tipo de método de pago es requerido',
      status: 400,
    });
  }

  const paymentMethod = await methodsService.createPaymentMethod({
    name,
    paymentTypeId,
    properties,
    isActive,
  });

  responser.success({
    res,
    body: { paymentMethod },
    status: 201,
  });
});

const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const paymentMethod = await methodsService.updatePaymentMethod(id, data);

  responser.success({
    res,
    body: { paymentMethod },
  });
});

const deletePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await methodsService.deletePaymentMethod(id);
  responser.success({
    res,
    body: result,
  });
});

export default {
  getPaymentMethods,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};

import orderService from '../services/order.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getOrders = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, buyerId } = req.query;
  const orders = await orderService.getAllOrders({ startDate, endDate, status, buyerId });
  responser.success({
    res,
    body: { orders },
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);
  responser.success({
    res,
    body: { order },
  });
});

const getOrdersByBuyerId = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;
  if (!buyerId) {
    return responser.error({
      res,
      message: 'El ID de comprador es requerido',
      status: 400,
    });
  }
  const orders = await orderService.getOrdersByBuyerId(buyerId);
  responser.success({
    res,
    body: { orders },
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const orderData = req.body;
  const order = await orderService.createOrder(orderData);
  responser.success({
    res,
    body: { order },
    status: 201,
  });
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const orderData = req.body;
  const order = await orderService.updateOrder(id, orderData);
  responser.success({
    res,
    body: { order },
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await orderService.deleteOrder(id);
  responser.success({
    res,
    body: result,
  });
});

export {
  getOrders,
  getOrder,
  getOrdersByBuyerId,
  createOrder,
  updateOrder,
  deleteOrder,
};

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
  // Security check: only buyer or admin can see the order
  if (Number(req.user.id) !== Number(order.buyerId) && req.user.role !== 'admin') {
    return responser.error({
      res,
      message: 'No tienes permiso para ver esta orden',
      status: 403,
    });
  }

  responser.success({
    res,
    body: { order },
  });
});

const getOrdersByBuyerId = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;
  const { startDate, endDate, page = 1, limit = 20 } = req.query;
  // console.log("req.user.role", req.user.role)
  // Security check: only buyer or admin can see the orders
  if (Number(req.user.id) !== Number(buyerId) && req.user.role !== 'admin') {
    return responser.error({
      res,
      message: 'No tienes permiso para ver estas órdenes',
      status: 403,
    });
  }

  if (!buyerId) {
    return responser.error({
      res,
      message: 'El ID de comprador es requerido',
      status: 400,
    });
  }
  const orders = await orderService.getOrdersByBuyerId(buyerId, { startDate, endDate, page, limit });
  responser.success({
    res,
    body: { orders },
  });
});

const createOrder = asyncHandler(async (req, res) => {
  const orderData = req.body;

  // Security: Force buyerId to be the authenticated user unless admin
  if (req.user.role !== 'admin') {
    orderData.buyerId = req.user.id;
  }

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

  const order = await orderService.getOrderById(id);

  // Security check: only buyer or admin can update
  if (Number(req.user.id) !== Number(order.buyerId) && req.user.role !== 'admin') {
    return responser.error({
      res,
      message: 'No tienes permiso para actualizar esta orden',
      status: 403,
    });
  }

  // Security check: buyers can only cancel their orders, not change other fields
  if (req.user.role !== 'admin') {
    if (orderData.status && orderData.status !== 'cancelled') {
       return responser.error({
        res,
        message: 'No tienes permiso para cambiar el estado de la orden',
        status: 403,
      });
    }
    // Filter out other fields that shouldn't be updated by user
    const allowedFields = ['status', 'address', 'phone'];
    Object.keys(orderData).forEach(key => {
      if (!allowedFields.includes(key)) delete orderData[key];
    });
  }

  const updatedOrder = await orderService.updateOrder(id, orderData);
  responser.success({
    res,
    body: { order: updatedOrder },
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await orderService.getOrderById(id);

  // Security check: only admin can delete orders
  if (req.user.role !== 'admin') {
    return responser.error({
      res,
      message: 'No tienes permiso para eliminar órdenes',
      status: 403,
    });
  }

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

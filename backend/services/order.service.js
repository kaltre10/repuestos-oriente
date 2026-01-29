import { Op } from 'sequelize';
import models from '../models/index.js';
const { Order } = models;

class OrderService {

  async getAllOrders(filters = {}) {
    try {
      const where = {};
      const { startDate, endDate, status, buyerId } = filters;

      if (startDate && endDate) {
        // Configurar zona horaria de Venezuela (UTC-4)
        const venezuelaOffset = -4;
        
        // Convertir fechas a objetos Date y aplicar offset de Venezuela
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Ajustar fecha de inicio a medianoche en Venezuela
        start.setHours(0, 0, 0, 0);
        start.setUTCHours(start.getUTCHours() + venezuelaOffset);
        
        // Ajustar fecha de fin a medianoche del día siguiente en Venezuela
        end.setHours(23, 59, 59, 999);
        end.setUTCHours(end.getUTCHours() + venezuelaOffset);
        
        where.createdAt = {
          [Op.between]: [start, end]
        };
      }

      if (status) {
        where.status = status;
      }

      if (buyerId) {
        where.buyerId = buyerId;
      }

      const orders = await Order.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: models.User,
            as: 'buyer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return orders;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: models.User,
            as: 'buyer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  }

  async getOrdersByBuyerId(buyerId) {
    try {
      const orders = await Order.findAll({
        where: { buyerId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: models.User,
            as: 'buyer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders by buyer id:', error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const order = await Order.create(orderData);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrder(orderId, orderData) {
    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      const updatedOrder = await order.update(orderData);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      await order.destroy();
      return { message: 'Order deleted successfully' };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

export default new OrderService();

import { Op } from 'sequelize';
import models from '../models/index.js';
import imageService from './image.service.js';

const { Sale } = models;

class SaleService {

  async getAllSales(filters = {}) {
    try {
      
      const { startDate, endDate, status, paymentMethod } = filters;
      
      // Usar la misma lógica que la consulta manual
      const where = {};
      
      // Filtro por fecha usando literales para comparación directa en MySQL
      if (startDate && endDate) {
        where.saleDate = {
          [Op.between]: [
            `${startDate} 00:00:00`,
            `${endDate} 23:59:59`
          ]
        };
      }
      
      // Filtro por método de pago
      if (paymentMethod) {
        where.paymentMethod = paymentMethod;
      }
      
      // Consulta simple para probar
      const sales = await Sale.findAll({
        where,
        include: [
          {
            model: models.Product,
            as: 'product',
            include: [{ model: models.ProductImage, as: 'images', attributes: ['image'] }]
          },
          { model: models.User, as: 'buyer' },
          {
            model: models.Order,
            as: 'order',
            where: status ? { status } : {}, // Aplicar filtro de status a la orden
            attributes: ['id', 'orderNumber', 'status', 'shippingCost', 'total', 'paymentMethodId', 'shippingMethod', 'shippingAddress', 'clientName', 'clientEmail', 'clientPhone', 'createdAt', 'updatedAt'],
            include: [
              {
                model: models.PaymentMethod,
                as: 'paymentMethod',
                attributes: ['id', 'name']
              }
            ]
          }
        ],
        order: [['saleDate', 'DESC']]
      });

      if (sales.length > 0) {
        // console.log('Primera venta encontrada:', JSON.stringify(sales[0], null, 2));
      }
      
      return sales;
    } catch (error) {
      throw new Error(`Error al obtener ventas: ${error.message}`);
    }
  }

  async getSaleById(id) {
    try {
      const sale = await Sale.findByPk(id, {
        include: [
          {
            model: models.Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'partNumber'],
            include: [{ model: models.ProductImage, as: 'images', attributes: ['image'] }]
          },
          {
            model: models.Order,
            as: 'order',
            attributes: ['id', 'orderNumber', 'status', 'shippingCost', 'total', 'paymentMethodId', 'shippingMethod', 'shippingAddress', 'clientName', 'clientEmail', 'clientPhone', 'createdAt', 'updatedAt'],
            include: [{
              model: models.PaymentMethod,
              as: 'paymentMethod',
              attributes: ['id', 'name']
            }]
          }
        ]
      });
      if (!sale) {
        throw new Error('Venta no encontrada');
      }
      return sale;
    } catch (error) {
      throw new Error(`Error al obtener venta: ${error.message}`);
    }
  }

  async createSale(saleData, options = {}) {
    try {
      const sale = await Sale.create(saleData, options);
      return sale;
    } catch (error) {
      throw new Error(`Error al crear venta: ${error.message}`);
    }
  }

  async createMultipleSales(salesData, options = {}) {
    try {
      const sales = await Sale.bulkCreate(salesData, options);
      return sales;
    } catch (error) {
      throw new Error(`Error al crear múltiples ventas: ${error.message}`);
    }
  }

  async getSalesByUserId(userId, options = {}) {
    try {
      const { startDate, endDate, page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      
      const where = { buyerId: userId };
      
      if (startDate && endDate) {
        // Usar literales de fecha para que MySQL compare directamente sin conversiones de zona horaria de JS
        // Esto busca entre el inicio del día y el final del día en el formato de la base de datos
        where.saleDate = {
          [Op.between]: [
            `${startDate} 00:00:00`,
            `${endDate} 23:59:59`
          ]
        };
      }

      const sales = await Sale.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{
          model: models.Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'partNumber'],
          include: [{
            model: models.ProductImage,
            as: 'images',
            attributes: ['image']
          }]
        },
        {
          model: models.Order,
          as: 'order',
          attributes: ['id', 'orderNumber', 'status', 'shippingCost', 'total', 'paymentMethodId', 'shippingMethod', 'shippingAddress', 'clientName', 'clientEmail', 'clientPhone', 'createdAt', 'updatedAt'],
          include: [{
            model: models.PaymentMethod,
            as: 'paymentMethod',
            attributes: ['id', 'name']
          }]
        }]
      });
      return sales;
    } catch (error) {
      throw new Error(`Error al obtener ventas por ID de usuario: ${error.message}`);
    }
  }

  async getStats(startDate, endDate) {
    try {
      const where = {};
      if (startDate && endDate) {
        // Convertir fechas a objetos Date sin offset (usar UTC)
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Ajustar fecha de inicio a medianoche UTC
        start.setHours(0, 0, 0, 0);
        
        // Ajustar fecha de fin a medianoche UTC del día siguiente
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);
        
        // Filtrar por saleDate (fecha de venta) en lugar de createdAt
        where.saleDate = {
          [Op.between]: [start, end]
        };
      }

      const sales = await Sale.findAll({
        where,
        attributes: ['id', 'quantity', 'unitPrice', 'originalPrice', 'discount', 'saleDate', 'createdAt'],
        include: [{
          model: models.Product,
          as: 'product',
          attributes: ['name']
        }]
      });

      return sales;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  async updateSale(id, updateData) {
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        throw new Error('Venta no encontrada');
      }

      await sale.update(updateData);
      return sale;
    } catch (error) {
      throw new Error(`Error al actualizar venta: ${error.message}`);
    }
  }

  async deleteSale(id) {
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        throw new Error('Venta no encontrada');
      }

      await sale.destroy();
      return { message: 'Venta eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar venta: ${error.message}`);
    }
  }
}

export default new SaleService();

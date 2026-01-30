import { Op } from 'sequelize';
import models from '../models/index.js';
const { Sale } = models;

class SaleService {

  async getAllSales(filters = {}) {
    try {
      
      const { startDate, endDate, status, paymentMethod } = filters;
      
      // Usar la misma lógica que la consulta manual
      const where = {};
      
      // Filtro por fecha
      if (startDate && endDate) {
        
        // Crear fechas con la zona horaria configurada (America/Caracas)
        // Parsear fechas en formato YYYY-MM-DD con horas locales
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59.999`);
        
        
        where.saleDate = { [Op.between]: [start, end] };
      }
      
      // Filtro por método de pago
      if (paymentMethod) {
        where.paymentMethod = paymentMethod;
      }
      
      // Consulta simple para probar
      const sales = await Sale.findAll({
        where,
        include: [
          { model: models.Product, as: 'product' },
          { model: models.User, as: 'buyer' },
          {
            model: models.Order,
            as: 'order',
            where: status ? { status } : {}, // Aplicar filtro de status a la orden
            attributes: ['id', 'status', 'shippingCost', 'total', 'paymentMethodId', 'shippingMethod', 'shippingAddress', 'createdAt', 'updatedAt'],
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
        console.log('Primera venta encontrada:', JSON.stringify(sales[0], null, 2));
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
            attributes: ['id', 'name', 'price', 'partNumber', 'images']
          },
          {
            model: models.Order,
            as: 'order',
            attributes: ['id', 'status', 'shippingCost', 'total', 'paymentMethodId', 'shippingMethod', 'shippingAddress', 'createdAt', 'updatedAt'],
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

  async createSale(saleData) {
    try {
      const sale = await Sale.create(saleData);
      return sale;
    } catch (error) {
      throw new Error(`Error al crear venta: ${error.message}`);
    }
  }

  async createMultipleSales(salesData) {
    try {
      const sales = await Sale.bulkCreate(salesData);
      return sales;
    } catch (error) {
      throw new Error(`Error al crear múltiples ventas: ${error.message}`);
    }
  }

  async getSalesByUserId(userId) {
    try {
      const sales = await Sale.findAll({
        where: {
          buyerId: userId
        },
        order: [['createdAt', 'DESC']],
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
          attributes: ['id', 'status', 'shippingCost', 'total', 'paymentMethodId', 'shippingMethod', 'shippingAddress', 'createdAt', 'updatedAt'],
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

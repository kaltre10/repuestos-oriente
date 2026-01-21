import { Op } from 'sequelize';
import models from '../models/index.js';
const { Sale } = models;

class SaleService {

  async getAllSales(filters = {}) {
    try {
      const where = {};
      const { startDate, endDate, status, paymentMethod } = filters;

      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      if (status) {
        where.status = status;
      }

      if (paymentMethod) {
        where.paymentMethod = paymentMethod;
      }

      const sales = await Sale.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          {
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
            model: models.User,
            as: 'buyer',
            attributes: ['id', 'name', 'email']
          }
        ]
      });
      return sales;
    } catch (error) {
      throw new Error(`Failed to get sales: ${error.message}`);
    }
  }

  async getSaleById(id) {
    try {
      const sale = await Sale.findByPk(id, {
        include: [{
          model: models.Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'partNumber']
        }]
      });
      if (!sale) {
        throw new Error('Sale not found');
      }
      return sale;
    } catch (error) {
      throw new Error(`Failed to get sale: ${error.message}`);
    }
  }

  async createSale(saleData) {
    try {
      const sale = await Sale.create(saleData);
      return sale;
    } catch (error) {
      throw new Error(`Failed to create sale: ${error.message}`);
    }
  }

  async createMultipleSales(salesData) {
    try {
      const sales = await Sale.bulkCreate(salesData);
      return sales;
    } catch (error) {
      throw new Error(`Failed to create multiple sales: ${error.message}`);
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
        }]
      });
      return sales;
    } catch (error) {
      throw new Error(`Failed to get sales by user ID: ${error.message}`);
    }
  }

  async getStats(startDate, endDate) {
    try {
      const where = {};
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const sales = await Sale.findAll({
        where,
        attributes: ['id', 'quantity', 'dailyRate', 'createdAt'],
        include: [{
          model: models.Product,
          as: 'product',
          attributes: ['price']
        }]
      });

      return sales;
    } catch (error) {
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }

  async updateSale(id, updateData) {
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        throw new Error('Sale not found');
      }

      await sale.update(updateData);
      return sale;
    } catch (error) {
      throw new Error(`Failed to update sale: ${error.message}`);
    }
  }

  async deleteSale(id) {
    try {
      const sale = await Sale.findByPk(id);
      if (!sale) {
        throw new Error('Sale not found');
      }

      await sale.destroy();
      return { message: 'Sale deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete sale: ${error.message}`);
    }
  }
}

export default new SaleService();

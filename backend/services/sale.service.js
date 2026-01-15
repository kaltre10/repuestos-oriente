import models from '../models/index.js';
const { Sale } = models;

class SaleService {

  async getAllSales() {
    try {
      const sales = await Sale.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: models.Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'partNumber']
        }]
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

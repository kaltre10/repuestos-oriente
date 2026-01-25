import models from '../models/index.js';
const { Product } = models;

class ProductService {

  async getAllProducts(filters = {}) {
    try {
      const { year } = filters;
      
      let products = await Product.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: models.ProductImage,
          as: 'images',
          attributes: ['image']
        }]
      });

      if (year) {
        const targetYear = parseInt(year);
        products = products.filter(product => {
          if (!product.years) return false;
          
          // Formato esperado: XXXX-XXXX
          const range = product.years.split('-');
          if (range.length === 2) {
            const startYear = parseInt(range[0]);
            const endYear = parseInt(range[1]);
            return targetYear >= startYear && targetYear <= endYear;
          }
          
          // Caso en que solo sea un año individual XXXX
          if (range.length === 1) {
            return parseInt(range[0]) === targetYear;
          }

          return false;
        });
      }

      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      await product.update(updateData);
      return product;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      await product.destroy();
      return { message: 'Producto eliminado con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default new ProductService();

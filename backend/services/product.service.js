import models from '../models/index.js';
const { Product } = models;

class ProductService {

  async getAllProducts() {
    try {
      const products = await Product.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: models.ProductImage,
          as: 'images',
          attributes: ['image']
        }]
      });
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

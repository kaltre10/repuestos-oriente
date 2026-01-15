import models from '../models/index.js';
const { Product } = models;

class ProductService {

  async getAllProducts() {
    try {
      const products = await Product.findAll({
        order: [['createdAt', 'DESC']]
      });
      return products;
    } catch (error) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.update(updateData);
      return product;
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.destroy();
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

export default new ProductService();

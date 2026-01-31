import { Op } from 'sequelize';
import models from '../models/index.js';
const { Product } = models;

class ProductService {

  async getAllProducts(filters = {}) {
    try {
      const { year, onSale, page = 1, limit = 20, sortBy } = filters;
      
      let where = {};
      
      if (onSale === 'true') {
        where.discount = {
          [Op.gt]: 0
        };
      }

      let products = await Product.findAll({
        where,
        order: [['id', 'ASC']],
        include: [
          {
            model: models.ProductImage,
            as: 'images',
            attributes: ['image']
          },
          {
            model: models.Sale,
            as: 'sales',
            attributes: ['rating'],
            where: {
              rating: {
                [Op.and]: [
                  { [Op.ne]: null },
                  { [Op.gte]: 1 },
                  { [Op.lte]: 5 }
                ]
              }
            },
            required: false
          }
        ]
      });

      // Calcular rating promedio para cada producto
      let processedProducts = products.map(product => {
        const productJSON = product.toJSON();
        const salesData = productJSON.sales || [];
        
        let averageRating = 0;
        let totalReviews = salesData.length;

        if (totalReviews > 0) {
          const sumRating = salesData.reduce((acc, sale) => acc + sale.rating, 0);
          averageRating = sumRating / totalReviews;
        }

        productJSON.rating = averageRating;
        productJSON.reviews = totalReviews;
        
        // Eliminar el array de sales para no enviar datos innecesarios
        delete productJSON.sales;
        
        return productJSON;
      });

      // Aplicar filtro de año en memoria
      if (year) {
        const targetYear = parseInt(year);
        processedProducts = processedProducts.filter(product => {
          if (!product.years) return false;
          
          const range = product.years.split('-');
          if (range.length === 2) {
            const startYear = parseInt(range[0]);
            const endYear = parseInt(range[1]);
            return targetYear >= startYear && targetYear <= endYear;
          }
          
          if (range.length === 1) {
            return parseInt(range[0]) === targetYear;
          }

          return false;
        });
      }

      // Aplicar ordenamiento en memoria
      if (sortBy === 'price-low') {
        processedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        processedProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'popular') {
        processedProducts.sort((a, b) => b.rating - a.rating);
      } else {
        // Orden predeterminado: por inserción (ID ascendente)
        processedProducts.sort((a, b) => a.id - b.id);
      }

      // Paginación en memoria
      const total = processedProducts.length;
      const start = (page - 1) * limit;
      const paginatedProducts = processedProducts.slice(start, start + limit);
      const hasMore = start + limit < total;

      return {
        products: paginatedProducts,
        pagination: {
          total,
          page,
          limit,
          hasMore
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [{
          model: models.ProductImage,
          as: 'images',
          attributes: ['image']
        }]
      });

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Obtener el promedio de rating de la tabla sales
      const salesData = await models.Sale.findAll({
        where: {
          productId: id,
          rating: {
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.gte]: 1 },
              { [Op.lte]: 5 }
            ]
          }
        },
        attributes: ['rating']
      });

      let averageRating = 0;
      let totalReviews = salesData.length;

      if (totalReviews > 0) {
        const sumRating = salesData.reduce((acc, sale) => acc + sale.rating, 0);
        averageRating = sumRating / totalReviews;
      }

      // Convertir a JSON y agregar los campos calculados
      const productJSON = product.toJSON();
      productJSON.rating = averageRating;
      productJSON.reviews = totalReviews;

      return productJSON;
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

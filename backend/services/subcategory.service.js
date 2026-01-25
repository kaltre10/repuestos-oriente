import { Op } from 'sequelize';
import models from '../models/index.js';
const { SubCategory, Category, Product } = models;

class SubCategoryService {

  async getAllSubCategories(onlyActive = false) {
    try {
      const subCategories = await SubCategory.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'category']
        }]
      });

      if (onlyActive) {
        // Obtenemos todos los productos con stock
        const activeProducts = await Product.findAll({
          where: {
            amount: { [Op.gt]: 0 }
          },
          attributes: ['subcategories']
        });

        // Extraemos los nombres de subcategorías únicos de los productos activos
        const activeSubCategoryNames = new Set();
        activeProducts.forEach(product => {
          if (product.subcategories) {
            product.subcategories.split(',').forEach(sub => activeSubCategoryNames.add(sub.trim()));
          }
        });

        // Filtramos las subcategorías que tienen al menos un producto activo
        return subCategories.filter(sub => activeSubCategoryNames.has(sub.subCategory));
      }

      return subCategories;
    } catch (error) {
      throw new Error(`Error al obtener subcategorías: ${error.message}`);
    }
  }

  async getSubCategoriesByCategoryId(categoryId) {
    try {
      const subCategories = await SubCategory.findAll({
        where: { categoryId },
        order: [['subCategory', 'ASC']]
      });
      return subCategories;
    } catch (error) {
      throw new Error(`Error al obtener subcategorías por ID de categoría: ${error.message}`);
    }
  }

  async getSubCategoryById(id) {
    try {
      const subCategory = await SubCategory.findByPk(id, {
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'category']
        }]
      });
      if (!subCategory) {
        throw new Error('Subcategoría no encontrada');
      }
      return subCategory;
    } catch (error) {
      throw new Error(`Error al obtener subcategoría: ${error.message}`);
    }
  }

  async createSubCategory(subCategoryData) {
    try {
      const subCategory = await SubCategory.create(subCategoryData);
      return subCategory;
    } catch (error) {
      throw new Error(`Error al crear subcategoría: ${error.message}`);
    }
  }

  async updateSubCategory(id, updateData) {
    try {
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        throw new Error('Subcategoría no encontrada');
      }

      await subCategory.update(updateData);
      return subCategory;
    } catch (error) {
      throw new Error(`Error al actualizar subcategoría: ${error.message}`);
    }
  }

  async deleteSubCategory(id) {
    try {
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        throw new Error('Subcategoría no encontrada');
      }

      await subCategory.destroy();
      return { message: 'Subcategoría eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar subcategoría: ${error.message}`);
    }
  }
}

export default new SubCategoryService();

import models from '../models/index.js';
const { SubCategory, Category } = models;

class SubCategoryService {

  async getAllSubCategories() {
    try {
      const subCategories = await SubCategory.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'category']
        }]
      });
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

import models from '../models/index.js';
const { Category } = models;

class CategoryService {

  async getAllCategories() {
    try {
      const categories = await Category.findAll({
        order: [['createdAt', 'DESC']]
      });
      return categories;
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  async getCategoryById(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }
      return category;
    } catch (error) {
      throw new Error(`Error al obtener categoría: ${error.message}`);
    }
  }

  async createCategory(categoryData) {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }

  async updateCategory(id, updateData) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      await category.update(updateData);
      return category;
    } catch (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }
  }

  async deleteCategory(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Categoría no encontrada');
      }

      await category.destroy();
      return { message: 'Categoría eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }
}

export default new CategoryService();

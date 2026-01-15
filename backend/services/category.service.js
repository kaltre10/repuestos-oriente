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
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  async getCategoryById(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error(`Failed to get category: ${error.message}`);
    }
  }

  async createCategory(categoryData) {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async updateCategory(id, updateData) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }

      await category.update(updateData);
      return category;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async deleteCategory(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }

      await category.destroy();
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}

export default new CategoryService();

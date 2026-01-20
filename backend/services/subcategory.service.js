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
      throw new Error(`Failed to get subcategories: ${error.message}`);
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
      throw new Error(`Failed to get subcategories by category ID: ${error.message}`);
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
        throw new Error('SubCategory not found');
      }
      return subCategory;
    } catch (error) {
      throw new Error(`Failed to get subcategory: ${error.message}`);
    }
  }

  async createSubCategory(subCategoryData) {
    try {
      const subCategory = await SubCategory.create(subCategoryData);
      return subCategory;
    } catch (error) {
      throw new Error(`Failed to create subcategory: ${error.message}`);
    }
  }

  async updateSubCategory(id, updateData) {
    try {
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        throw new Error('SubCategory not found');
      }

      await subCategory.update(updateData);
      return subCategory;
    } catch (error) {
      throw new Error(`Failed to update subcategory: ${error.message}`);
    }
  }

  async deleteSubCategory(id) {
    try {
      const subCategory = await SubCategory.findByPk(id);
      if (!subCategory) {
        throw new Error('SubCategory not found');
      }

      await subCategory.destroy();
      return { message: 'SubCategory deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete subcategory: ${error.message}`);
    }
  }
}

export default new SubCategoryService();

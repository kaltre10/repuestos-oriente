import models from '../models/index.js';
const { Brand } = models;

class BrandService {

  async getAllBrands() {
    try {
      const brands = await Brand.findAll({
        order: [['createdAt', 'DESC']]
      });
      return brands;
    } catch (error) {
      throw new Error(`Failed to get brands: ${error.message}`);
    }
  }

  async getBrandById(id) {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        throw new Error('Brand not found');
      }
      return brand;
    } catch (error) {
      throw new Error(`Failed to get brand: ${error.message}`);
    }
  }

  async createBrand(brandData) {
    try {
      const brand = await Brand.create(brandData);
      return brand;
    } catch (error) {
      throw new Error(`Failed to create brand: ${error.message}`);
    }
  }

  async updateBrand(id, updateData) {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        throw new Error('Brand not found');
      }

      await brand.update(updateData);
      return brand;
    } catch (error) {
      throw new Error(`Failed to update brand: ${error.message}`);
    }
  }

  async deleteBrand(id) {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        throw new Error('Brand not found');
      }

      await brand.destroy();
      return { message: 'Brand deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete brand: ${error.message}`);
    }
  }
}

export default new BrandService();

import models from '../models/index.js';
const { Brand } = models;

class BrandService {

  async getAllBrands() {
    try {
      const brands = await Brand.findAll({
        where: { softDelete: 0 },
        order: [['brand', 'ASC']]
      });
      return brands;
    } catch (error) {
      throw new Error(`Error al obtener marcas: ${error.message}`);
    }
  }

  async getBrandById(id) {
    try {
      const brand = await Brand.findOne({
        where: { id, softDelete: 0 }
      });
      if (!brand) {
        throw new Error('Marca no encontrada');
      }
      return brand;
    } catch (error) {
      throw new Error(`Error al obtener marca: ${error.message}`);
    }
  }

  async createBrand(brandData) {
    try {
      const brand = await Brand.create(brandData);
      return brand;
    } catch (error) {
      throw new Error(`Error al crear marca: ${error.message}`);
    }
  }

  async updateBrand(id, updateData) {
    try {
      const brand = await Brand.findOne({
        where: { id, softDelete: 0 }
      });
      if (!brand) {
        throw new Error('Marca no encontrada');
      }

      await brand.update(updateData);
      return brand;
    } catch (error) {
      throw new Error(`Error al actualizar marca: ${error.message}`);
    }
  }

  async deleteBrand(id) {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        throw new Error('Marca no encontrada');
      }

      await brand.update({ softDelete: 1 });
      return { message: 'Marca eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar marca: ${error.message}`);
    }
  }
}

export default new BrandService();

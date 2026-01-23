import models from '../models/index.js';
const { Model, Brand } = models;

class ModelService {

  async getAllModels() {
    try {
      const allModels = await Model.findAll({
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand'],
          where: { softDelete: 0 },
          required: false
        }],
        order: [['createdAt', 'DESC']]
      });
      return allModels;
    } catch (error) {
      throw new Error(`Error al obtener modelos: ${error.message}`);
    }
  }

  async getModelById(id) {
    try {
      const model = await Model.findByPk(id, {
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand'],
          where: { softDelete: 0 },
          required: false
        }]
      });
      if (!model) {
        throw new Error('Modelo no encontrado');
      }
      return model;
    } catch (error) {
      throw new Error(`Error al obtener modelo: ${error.message}`);
    }
  }

  async createModel(modelData) {
    try {
      const model = await Model.create(modelData);
      const createdModel = await Model.findByPk(model.id, {
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand'],
          where: { softDelete: 0 },
          required: false
        }]
      });
      return createdModel;
    } catch (error) {
      throw new Error(`Error al crear modelo: ${error.message}`);
    }
  }

  async updateModel(id, updateData) {
    try {
      const model = await Model.findByPk(id);
      if (!model) {
        throw new Error('Modelo no encontrado');
      }

      await model.update(updateData);
      
      const updatedModel = await Model.findByPk(id, {
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand'],
          where: { softDelete: 0 },
          required: false
        }]
      });
      return updatedModel;
    } catch (error) {
      throw new Error(`Error al actualizar modelo: ${error.message}`);
    }
  }

  async deleteModel(id) {
    try {
      const model = await Model.findByPk(id);
      if (!model) {
        throw new Error('Modelo no encontrado');
      }

      await model.destroy();
      return { message: 'Modelo eliminado con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar modelo: ${error.message}`);
    }
  }
}

export default new ModelService();

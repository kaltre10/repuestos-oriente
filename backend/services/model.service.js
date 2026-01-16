import models from '../models/index.js';
const { Model, Brand } = models;

class ModelService {

  async getAllModels() {
    try {
      const allModels = await Model.findAll({
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand']
        }],
        order: [['createdAt', 'DESC']]
      });
      return allModels;
    } catch (error) {
      throw new Error(`Failed to get models: ${error.message}`);
    }
  }

  async getModelById(id) {
    try {
      const model = await Model.findByPk(id, {
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand']
        }]
      });
      if (!model) {
        throw new Error('Model not found');
      }
      return model;
    } catch (error) {
      throw new Error(`Failed to get model: ${error.message}`);
    }
  }

  async createModel(modelData) {
    try {
      const model = await Model.create(modelData);
      const createdModel = await Model.findByPk(model.id, {
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand']
        }]
      });
      return createdModel;
    } catch (error) {
      throw new Error(`Failed to create model: ${error.message}`);
    }
  }

  async updateModel(id, updateData) {
    try {
      const model = await Model.findByPk(id);
      if (!model) {
        throw new Error('Model not found');
      }

      await model.update(updateData);
      
      const updatedModel = await Model.findByPk(id, {
        include: [{
          model: Brand,
          as: 'brand',
          attributes: ['brand']
        }]
      });
      return updatedModel;
    } catch (error) {
      throw new Error(`Failed to update model: ${error.message}`);
    }
  }

  async deleteModel(id) {
    try {
      const model = await Model.findByPk(id);
      if (!model) {
        throw new Error('Model not found');
      }

      await model.destroy();
      return { message: 'Model deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete model: ${error.message}`);
    }
  }
}

export default new ModelService();

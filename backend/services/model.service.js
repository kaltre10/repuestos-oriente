import models from '../models/index.js';
const { Model } = models;

class ModelService {

  async getAllModels() {
    try {
      const models = await Model.findAll({
        order: [['createdAt', 'DESC']]
      });
      return models;
    } catch (error) {
      throw new Error(`Failed to get models: ${error.message}`);
    }
  }

  async getModelById(id) {
    try {
      const model = await Model.findByPk(id);
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
      return model;
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
      return model;
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

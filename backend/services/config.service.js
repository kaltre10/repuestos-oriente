import models from '../models/index.js';
const { Config } = models;

class ConfigService {

  async getAllConfigs() {
    try {
      const configs = await Config.findAll({
        order: [['createdAt', 'DESC']]
      });
      return configs;
    } catch (error) {
      throw new Error(`Failed to get configs: ${error.message}`);
    }
  }

  async getConfigById(id) {
    try {
      const config = await Config.findByPk(id);
      if (!config) {
        throw new Error('Config not found');
      }
      return config;
    } catch (error) {
      throw new Error(`Failed to get config: ${error.message}`);
    }
  }

  async createConfig(configData) {
    try {
      const config = await Config.create(configData);
      return config;
    } catch (error) {
      throw new Error(`Failed to create config: ${error.message}`);
    }
  }

  async updateConfig(id, updateData) {
    try {
      const config = await Config.findByPk(id);
      if (!config) {
        throw new Error('Config not found');
      }

      await config.update(updateData);
      return config;
    } catch (error) {
      throw new Error(`Failed to update config: ${error.message}`);
    }
  }

  async deleteConfig(id) {
    try {
      const config = await Config.findByPk(id);
      if (!config) {
        throw new Error('Config not found');
      }

      await config.destroy();
      return { message: 'Config deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete config: ${error.message}`);
    }
  }
}

export default new ConfigService();

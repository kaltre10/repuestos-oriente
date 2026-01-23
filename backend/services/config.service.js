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
      throw new Error(`Error al obtener configuraciones: ${error.message}`);
    }
  }

  async getConfigById(id) {
    try {
      const config = await Config.findByPk(id);
      if (!config) {
        throw new Error('Configuración no encontrada');
      }
      return config;
    } catch (error) {
      throw new Error(`Error al obtener configuración: ${error.message}`);
    }
  }

  async createConfig(configData) {
    try {
      const config = await Config.create(configData);
      return config;
    } catch (error) {
      throw new Error(`Error al crear configuración: ${error.message}`);
    }
  }

  async updateConfig(id, updateData) {
    try {
      const config = await Config.findByPk(id);
      if (!config) {
        throw new Error('Configuración no encontrada');
      }

      await config.update(updateData);
      return config;
    } catch (error) {
      throw new Error(`Error al actualizar configuración: ${error.message}`);
    }
  }

  async deleteConfig(id) {
    try {
      const config = await Config.findByPk(id);
      if (!config) {
        throw new Error('Configuración no encontrada');
      }

      await config.destroy();
      return { message: 'Configuración eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar configuración: ${error.message}`);
    }
  }
}

export default new ConfigService();

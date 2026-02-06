import https from 'https';
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

  /**
   * Obtiene el precio del dólar desde el BCV
   */
  async fetchDolarRateFromBCV() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.bcv.org.ve',
        port: 443,
        path: '/',
        method: 'GET',
        rejectUnauthorized: false, // Omitir validación de certificado SSL
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9',
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            // Buscamos el valor del USD usando una expresión regular
            const usdRegex = /<div[^>]*id="dolar"[^>]*>[\s\S]*?<strong>\s*([\d,.]+)\s*<\/strong>/i;
            const match = data.match(usdRegex);

            if (!match || !match[1]) {
              const fallbackRegex = /USD[\s\S]*?<strong>\s*([\d,.]+)\s*<\/strong>/i;
              const fallbackMatch = data.match(fallbackRegex);
              
              if (!fallbackMatch || !fallbackMatch[1]) {
                return reject(new Error('No se pudo encontrar el precio del dólar en el HTML del BCV'));
              }
              return resolve(parseFloat(fallbackMatch[1].replace(',', '.')));
            }

            resolve(parseFloat(match[1].replace(',', '.')));
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error fetching BCV rate:', error);
        reject(new Error(`Error al conectar con el BCV: ${error.message}`));
      });

      req.end();
    });
  }

  /**
   * Actualiza el dolarRate en la tabla Config con el valor del BCV
   */
  async updateDolarRateFromBCV() {
    try {
      const rate = await this.fetchDolarRateFromBCV();
      
      if (!rate || isNaN(rate)) {
        throw new Error('El valor de la tasa obtenido no es válido');
      }

      // Buscamos la primera configuración (o la más reciente)
      let config = await Config.findOne({ order: [['createdAt', 'DESC']] });
      
      if (!config) {
        // Si no hay configuración, creamos una con valores por defecto
        config = await Config.create({
          dolarRate: rate,
          freeShippingThreshold: 200,
          shippingPrice: 0
        });
      } else {
        await config.update({ dolarRate: rate });
      }
      
      return config;
    } catch (error) {
      console.error('CRITICAL ERROR in updateDolarRateFromBCV:', error.message);
      // No lanzamos el error para evitar crashear la app si se llama desde un contexto no controlado
      // Pero el controlador que usa asyncHandler sí debería recibirlo si queremos que responda error
      throw error; 
    }
  }
}

export default new ConfigService();

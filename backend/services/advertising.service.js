import models from '../models/index.js';
import fs from 'fs';
import path from 'path';
const { Advertising } = models;

class AdvertisingService {
  async getAllAdvertising() {
    try {
      const advertising = await Advertising.findAll({
        order: [['id', 'DESC']],
      });
      return advertising;
    } catch (error) {
      throw new Error(`Error al obtener publicidad: ${error.message}`);
    }
  }

  async getAdvertisingById(id) {
    try {
      const advertising = await Advertising.findByPk(id);
      if (!advertising) {
        throw new Error('Publicidad no encontrada');
      }
      return advertising;
    } catch (error) {
      throw new Error(`Error al obtener publicidad: ${error.message}`);
    }
  }

  async getActiveAdvertising() {
    try {
      const advertising = await Advertising.findOne({
        where: { status: true }
      });
      return advertising;
    } catch (error) {
      throw new Error(`Error al obtener publicidad activa: ${error.message}`);
    }
  }

  async createAdvertising(data) {
    try {
      const { image, link, buttonText, status } = data;
      let imageData = image;

      // Handle base64 image if provided
      if (image && image.startsWith('data:image')) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const extension = image.split(';')[0].split('/')[1];
        const fileName = `adv_${Date.now()}.${extension}`;
        const dir = path.join(process.cwd(), 'images', 'advertising');

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, fileName);
        fs.writeFileSync(filePath, base64Data, 'base64');
        imageData = fileName;
      }

      const isActive = status === true || status === 'true';

      // If status is true, deactivate all others
      if (isActive) {
        await Advertising.update({ status: false }, { where: {} });
      }

      const advertising = await Advertising.create({
        image: imageData,
        link,
        buttonText: buttonText || 'Ver más',
        status: isActive
      });
      return advertising;
    } catch (error) {
      throw new Error(`Error al crear publicidad: ${error.message}`);
    }
  }

  async updateAdvertising(id, data) {
    try {
      const advertising = await Advertising.findByPk(id);
      if (!advertising) {
        throw new Error('Publicidad no encontrada');
      }

      const { image, link, buttonText, status } = data;
      let imageData = image;

      // Handle base64 image
      if (image && image.startsWith('data:image')) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const extension = image.split(';')[0].split('/')[1];
        const fileName = `adv_${id}_${Date.now()}.${extension}`;
        const dir = path.join(process.cwd(), 'images', 'advertising');

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, fileName);

        // Delete old image if exists
        if (advertising.image && !advertising.image.startsWith('http')) {
          const oldPath = path.join(dir, advertising.image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        fs.writeFileSync(filePath, base64Data, 'base64');
        imageData = fileName;
      }

      const isActive = status === true || status === 'true';

      // If status is true, deactivate all others
      if (isActive) {
        await Advertising.update({ status: false }, { where: {} });
      }

      await advertising.update({
        image: imageData,
        link,
        buttonText: buttonText || advertising.buttonText,
        status: isActive
      });
      return advertising;
    } catch (error) {
      throw new Error(`Error al actualizar publicidad: ${error.message}`);
    }
  }

  async deleteAdvertising(id) {
    try {
      const advertising = await Advertising.findByPk(id);
      if (!advertising) {
        throw new Error('Publicidad no encontrada');
      }

      // Delete image file
      if (advertising.image && !advertising.image.startsWith('http')) {
        const dir = path.join(process.cwd(), 'images', 'advertising');
        const filePath = path.join(dir, advertising.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await advertising.destroy();
      return { message: 'Publicidad eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar publicidad: ${error.message}`);
    }
  }
}

export default new AdvertisingService();

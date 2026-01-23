import models from '../models/index.js';
import fs from 'fs';
import path from 'path';
const { Slider } = models;

class SliderService {
  async getAllSliders() {
    try {
      const sliders = await Slider.findAll({
        order: [['id', 'ASC']],
      });
      return sliders;
    } catch (error) {
      throw new Error(`Error al obtener sliders: ${error.message}`);
    }
  }

  async getSliderById(id) {
    try {
      const slider = await Slider.findByPk(id);
      if (!slider) {
        throw new Error('Slider no encontrado');
      }
      return slider;
    } catch (error) {
      throw new Error(`Error al obtener slider: ${error.message}`);
    }
  }

  async createSlider(data) {
    try {
      let imageData = data.image;

      // Handle base64 image if provided
      if (data.image && data.image.startsWith('data:image')) {
        const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
        const extension = data.image.split(';')[0].split('/')[1];
        const fileName = `slider_${Date.now()}.${extension}`;
        const dir = path.join(process.cwd(), 'images', 'sliders');

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, fileName);
        fs.writeFileSync(filePath, base64Data, 'base64');
        imageData = fileName;
      }

      const slider = await Slider.create({
        ...data,
        image: imageData,
      });
      return slider;
    } catch (error) {
      throw new Error(`Error al crear slider: ${error.message}`);
    }
  }

  async updateSlider(id, data) {
    try {
      const slider = await Slider.findByPk(id);
      if (!slider) {
        throw new Error('Slider no encontrado');
      }

      let imageData = data.image;

      // Handle base64 image
      if (data.image && data.image.startsWith('data:image')) {
        const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
        const extension = data.image.split(';')[0].split('/')[1];
        const fileName = `slider_${id}_${Date.now()}.${extension}`;
        const dir = path.join(process.cwd(), 'images', 'sliders');

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, fileName);

        // Delete old image if exists
        if (slider.image && !slider.image.startsWith('http')) {
          const oldPath = path.join(dir, slider.image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        fs.writeFileSync(filePath, base64Data, 'base64');
        imageData = fileName;
      }

      await slider.update({
        ...data,
        image: imageData,
      });
      return slider;
    } catch (error) {
      throw new Error(`Error al actualizar slider: ${error.message}`);
    }
  }

  async deleteSlider(id) {
    try {
      const slider = await Slider.findByPk(id);
      if (!slider) {
        throw new Error('Slider no encontrado');
      }

      // Delete image if exists
      if (slider.image && !slider.image.startsWith('http')) {
        const dir = path.join(process.cwd(), 'images', 'sliders');
        const filePath = path.join(dir, slider.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await slider.destroy();
      return { message: 'Slider eliminado con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar slider: ${error.message}`);
    }
  }
}

export default new SliderService();

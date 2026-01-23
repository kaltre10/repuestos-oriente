import fs from 'fs';
import path from 'path';
import models from '../models/index.js';
const { ProductImage } = models;

class ImageService {
  async uploadImages(productId, files) {
    try {
      if (!files || files.length === 0) return [];

      const imagePromises = files.map(async (file) => {
        // file.path is the relative path from the server root
        // We want to store the URL or path to be accessed via frontend
        const imageUrl = file.filename;
        
        return await ProductImage.create({
          productId,
          image: imageUrl
        });
      });

      return await Promise.all(imagePromises);
    } catch (error) {
      throw new Error(`Error al subir imágenes: ${error.message}`);
    }
  }

  async deleteImage(imageId) {
    try {
      const image = await ProductImage.findByPk(imageId);
      if (!image) throw new Error('Imagen no encontrada');

      // Delete physical file
      const filePath = path.join(process.cwd(), 'images/products', path.basename(image.image));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await image.destroy();
      return { message: 'Imagen eliminada con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  }

  async getProductImages(productId) {
    try {
      return await ProductImage.findAll({
        where: { productId }
      });
    } catch (error) {
      throw new Error(`Error al obtener imágenes: ${error.message}`);
    }
  }
}

export default new ImageService();

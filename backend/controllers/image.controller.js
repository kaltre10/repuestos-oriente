import imageService from '../services/image.service.js';
import responser from './responser.js';

class ImageController {
  async upload(req, res, next) {
    try {
      const { productId } = req.body;
      const files = req.files;

      if (!productId) {
        return responser.error({ res, message: 'El ID del producto es requerido', status: 400 });
      }

      const images = await imageService.uploadImages(productId, files);
      responser.success({ res, message: 'Imágenes subidas con éxito', body: images });
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const { id } = req.params;
      const result = await imageService.deleteImage(id);
      responser.success({ res, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  async getByProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const images = await imageService.getProductImages(productId);
      responser.success({ res, body: images });
    } catch (error) {
      next(error);
    }
  }
}

export default new ImageController();

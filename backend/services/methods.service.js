import models from '../models/index.js';
const { PaymentMethod } = models;

class PaymentMethodService {
  async getAllPaymentMethods() {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        include: [
          {
            model: models.PaymentType,
            as: 'paymentType',
          }
        ],
        order: [['createdAt', 'DESC']],
      });
      return paymentMethods;
    } catch (error) {
      throw new Error(`Error al obtener métodos de pago: ${error.message}`);
    }
  }

  async getActivePaymentMethods() {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        include: [
          {
            model: models.PaymentType,
            as: 'paymentType',
          }
        ],
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return paymentMethods;
    } catch (error) {
      throw new Error(`Error al obtener métodos de pago activos: ${error.message}`);
    }
  }

  async getPaymentMethodById(id) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(id, {
        include: [
          {
            model: models.PaymentType,
            as: 'paymentType',
          }
        ]
      });
      if (!paymentMethod) {
        throw new Error('Método de pago no encontrado');
      }
      return paymentMethod;
    } catch (error) {
      throw new Error(`Error al obtener método de pago: ${error.message}`);
    }
  }

  async createPaymentMethod(data) {
    try {
      const paymentMethod = await PaymentMethod.create(data);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Error al crear método de pago: ${error.message}`);
    }
  }

  async updatePaymentMethod(id, data) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(id);
      if (!paymentMethod) {
        throw new Error('Método de pago no encontrado');
      }
      await paymentMethod.update(data);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Error al actualizar método de pago: ${error.message}`);
    }
  }

  async deletePaymentMethod(id) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(id);
      if (!paymentMethod) {
        throw new Error('Método de pago no encontrado');
      }
      await paymentMethod.destroy();
      return { message: 'Método de pago eliminado con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar método de pago: ${error.message}`);
    }
  }
}

export default new PaymentMethodService();

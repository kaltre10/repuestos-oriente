import models from '../models/index.js';
const { PaymentMethod } = models;

class PaymentMethodService {
  async getAllPaymentMethods() {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        order: [['createdAt', 'DESC']],
      });
      return paymentMethods;
    } catch (error) {
      throw new Error(`Failed to get payment methods: ${error.message}`);
    }
  }

  async getActivePaymentMethods() {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return paymentMethods;
    } catch (error) {
      throw new Error(`Failed to get active payment methods: ${error.message}`);
    }
  }

  async getPaymentMethodById(id) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(id);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to get payment method: ${error.message}`);
    }
  }

  async createPaymentMethod(data) {
    try {
      const paymentMethod = await PaymentMethod.create(data);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to create payment method: ${error.message}`);
    }
  }

  async updatePaymentMethod(id, data) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(id);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      await paymentMethod.update(data);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to update payment method: ${error.message}`);
    }
  }

  async deletePaymentMethod(id) {
    try {
      const paymentMethod = await PaymentMethod.findByPk(id);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      await paymentMethod.destroy();
      return { message: 'Payment method deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete payment method: ${error.message}`);
    }
  }
}

export default new PaymentMethodService();

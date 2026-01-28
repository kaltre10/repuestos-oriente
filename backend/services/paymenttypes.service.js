import models from '../models/index.js';
const { PaymentType } = models;

class PaymentTypeService {
  async getAllPaymentTypes() {
    try {
      const paymentTypes = await PaymentType.findAll({
        order: [['createdAt', 'DESC']],
        raw: true
      });
      // Ensure properties is always an array
      return paymentTypes.map(type => {
        let properties = type.properties;
        console.log('Raw properties from DB:', type.id, properties, typeof properties);
        
        // Handle JSON string if needed
        if (typeof properties === 'string') {
          try {
            properties = JSON.parse(properties);
            console.log('After parsing:', properties);
          } catch (e) {
            console.error('Error parsing properties:', e);
            properties = [];
          }
        }
        
        // Ensure properties is always an array
        properties = Array.isArray(properties) ? properties : [];
        console.log('Final properties:', properties);
        
        return {
          ...type,
          properties
        };
      });
    } catch (error) {
      throw new Error(`Error al obtener tipos de pago: ${error.message}`);
    }
  }

  async getPaymentTypeById(id) {
    try {
      const paymentType = await PaymentType.findByPk(id, { raw: true });
      if (!paymentType) {
        throw new Error('Tipo de pago no encontrado');
      }
      // Ensure properties is always an array
      let properties = paymentType.properties;
      if (typeof properties === 'string') {
        try {
          properties = JSON.parse(properties);
        } catch (e) {
          properties = [];
        }
      }
      return {
        ...paymentType,
        properties: Array.isArray(properties) ? properties : []
      };
    } catch (error) {
      throw new Error(`Error al obtener tipo de pago: ${error.message}`);
    }
  }

  async createPaymentType(data) {
    try {
      // Ensure properties is always an array before saving
      const normalizedData = {
        ...data,
        properties: Array.isArray(data.properties) ? data.properties : []
      };
      // Create without raw: true to get the proper instance
      const paymentTypeInstance = await PaymentType.create(normalizedData);
      // Get raw data from the instance
      const paymentType = paymentTypeInstance.get({ plain: true });
      // Ensure properties is always an array in the response
      let properties = paymentType.properties;
      if (typeof properties === 'string') {
        try {
          properties = JSON.parse(properties);
        } catch (e) {
          properties = [];
        }
      }
      return {
        ...paymentType,
        properties: Array.isArray(properties) ? properties : []
      };
    } catch (error) {
      throw new Error(`Error al crear tipo de pago: ${error.message}`);
    }
  }

  async updatePaymentType(id, data) {
    try {
      // Ensure properties is always an array before updating
      const normalizedData = {
        ...data,
        properties: Array.isArray(data.properties) ? data.properties : []
      };
      await PaymentType.update(normalizedData, { where: { id } });
      // Get the updated record with raw: true
      const updatedPaymentType = await PaymentType.findByPk(id, { raw: true });
      if (!updatedPaymentType) {
        throw new Error('Tipo de pago no encontrado después de actualizar');
      }
      // Ensure properties is always an array in the response
      let properties = updatedPaymentType.properties;
      if (typeof properties === 'string') {
        try {
          properties = JSON.parse(properties);
        } catch (e) {
          properties = [];
        }
      }
      return {
        ...updatedPaymentType,
        properties: Array.isArray(properties) ? properties : []
      };
    } catch (error) {
      throw new Error(`Error al actualizar tipo de pago: ${error.message}`);
    }
  }

  async deletePaymentType(id) {
    try {
      const paymentType = await PaymentType.findByPk(id);
      if (!paymentType) {
        throw new Error('Tipo de pago no encontrado');
      }
      await paymentType.destroy();
      return { message: 'Tipo de pago eliminado con éxito' };
    } catch (error) {
      throw new Error(`Error al eliminar tipo de pago: ${error.message}`);
    }
  }
}

export default new PaymentTypeService();

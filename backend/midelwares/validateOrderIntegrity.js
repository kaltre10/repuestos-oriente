import models from '../models/index.js';
import responser from '../controllers/responser.js';

/**
 * Middleware para validar la integridad de los precios, descuentos y stock
 * antes de procesar una orden o checkout.
 */
export const validateOrderIntegrity = async (req, res, next) => {
  try {
    let { items, productId, quantity, unitPrice, discount } = req.body;

    // Caso 1: Checkout con múltiples items (createCheckout)
    if (items) {
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (error) {
          return responser.error({
            res,
            message: 'Formato de items inválido',
            status: 400,
          });
        }
      }

      if (!Array.isArray(items)) {
        return responser.error({
          res,
          message: 'Los items deben ser un arreglo',
          status: 400,
        });
      }

      for (const item of items) {
        const product = await models.Product.findByPk(item.productId);
        
        if (!product) {
          return responser.error({
            res,
            message: `Producto con ID ${item.productId} no encontrado`,
            status: 404,
          });
        }

        // Validar Stock
        if (product.amount < item.quantity) {
          return responser.error({
            res,
            message: `Stock insuficiente para ${product.name}. Disponible: ${product.amount}`,
            status: 400,
          });
        }

        // Si el cliente envía precios/descuentos en el item, validarlos contra la DB
        if (item.price !== undefined || item.discount !== undefined) {
          const dbPrice = parseFloat(product.price);
          const dbDiscount = parseFloat(product.discount) || 0;
          
          const clientPrice = parseFloat(item.price);
          const clientDiscount = parseFloat(item.discount);

          if ((item.price !== undefined && clientPrice !== dbPrice) || 
              (item.discount !== undefined && clientDiscount !== dbDiscount)) {
            return responser.error({
              res,
              message: 'Error al realizar orden: El precio o descuento de un producto ha sido alterado.',
              status: 400,
            });
          }
        }
      }
    } 
    // Caso 2: Venta individual (createSale)
    else if (productId) {
      const product = await models.Product.findByPk(productId);
      
      if (!product) {
        return responser.error({
          res,
          message: 'Producto no encontrado',
          status: 404,
        });
      }

      // Validar Stock
      if (product.amount < quantity) {
        return responser.error({
          res,
          message: `Stock insuficiente. Disponible: ${product.amount}`,
          status: 400,
        });
      }

      // Validar integridad de precio y descuento si vienen en el body
      if (unitPrice !== undefined || discount !== undefined) {
        const dbPrice = parseFloat(product.price);
        const dbDiscount = parseFloat(product.discount) || 0;
        
        // Calculamos el precio esperado con descuento
        const expectedUnitPrice = dbPrice - (dbPrice * dbDiscount / 100);
        const clientUnitPrice = parseFloat(unitPrice);

        // Verificamos si hay discrepancia significativa (usando un pequeño margen por redondeo de decimales)
        if (Math.abs(clientUnitPrice - expectedUnitPrice) > 0.01) {
          return responser.error({
            res,
            message: 'Error al realizar orden: El precio fue alterado.',
            status: 400,
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error('Error en validateOrderIntegrity middleware:', error);
    return responser.error({
      res,
      message: 'Error interno al validar la integridad de la orden',
      status: 500,
    });
  }
};

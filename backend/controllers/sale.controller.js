import saleService from '../services/sale.service.js';
import orderService from '../services/order.service.js';
import userService from '../services/user.service.js';
import visitService from '../services/visit.service.js';
import configService from '../services/config.service.js';
import responser from './responser.js';
import models from '../models/index.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getSales = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, paymentMethod } = req.query;
  const sales = await saleService.getAllSales({ startDate, endDate, status, paymentMethod });
  responser.success({
    res,
    body: { sales },
  });
});

const getSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sale = await saleService.getSaleById(id);
  responser.success({
    res,
    body: { sale },
  });
});

const getSalesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate, page = 1, limit = 20 } = req.query;
  
  if (!userId) {
    return responser.error({
      res,
      message: 'El ID de usuario es requerido',
      status: 400,
    });
  }
  
  const sales = await saleService.getSalesByUserId(userId, { startDate, endDate, page, limit });
  responser.success({
    res,
    body: { sales },
  });
});

const createSale = asyncHandler(async (req, res) => {
  const {
    quantity,
    status,
    buyerId,
    paymentMethod,
    saleDate,
    productId,
    rating
  } = req.body;

  // Validation
  if (!quantity || !buyerId || !paymentMethod || !productId) {
    return responser.error({
      res,
      message: 'Campos requeridos: cantidad, ID del comprador, método de pago, ID del producto',
      status: 400,
    });
  }

  if (quantity <= 0) {
    return responser.error({
      res,
      message: 'La cantidad debe ser mayor a 0',
      status: 400,
    });
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return responser.error({
      res,
      message: 'La calificación debe estar entre 1 y 5',
      status: 400,
    });
  }

  // Get the current daily rate from config
  let dailyRate;
  try {
    const configs = await configService.getAllConfigs();
    if (configs.length === 0) {
      return responser.error({
        res,
        message: 'No se encontró ninguna configuración. Por favor, configure la tasa del dólar primero.',
        status: 400,
      });
    }
    // Use the most recent config (first in the array since ordered by createdAt DESC)
    dailyRate = configs[0].dolarRate;
  } catch (error) {
    return responser.error({
      res,
      message: 'Error al obtener la tasa diaria de la configuración',
      status: 500,
    });
  }

  const saleData = {
    dailyRate,
    quantity,
    status: status || 'pending',
    buyerId,
    paymentMethod,
    saleDate: saleDate || new Date(),
    productId,
    rating
  };

  const newSale = await saleService.createSale(saleData);
  responser.success({
    res,
    message: 'Venta creada con éxito',
    body: { sale: newSale },
  });
});

const updateSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validation
  if (updateData.quantity !== undefined && updateData.quantity <= 0) {
    return responser.error({
      res,
      message: 'La cantidad debe ser mayor a 0',
      status: 400,
    });
  }

  if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
    return responser.error({
      res,
      message: 'La calificación debe estar entre 1 y 5',
      status: 400,
    });
  }

  const updatedSale = await saleService.updateSale(id, updateData);
  responser.success({
    res,
    message: 'Venta actualizada con éxito',
    body: { sale: updatedSale },
  });
});

const deleteSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await saleService.deleteSale(id);
  responser.success({
    res,
    message: result.message,
  });
});

const createCheckout = asyncHandler(async (req, res) => {
  let {
    items, // Array of { productId, quantity }
    buyerId,
    clientName,
    clientEmail,
    clientPhone,
    paymentMethod,
    referenceNumber,
    shippingCost,
    freeShipping,
    shippingMethod,
    shippingAddress
  } = req.body;

  // If items is sent as a string (common with FormData), parse it
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (error) {
      return responser.error({
        res,
        message: 'Formato de items inválido. Debe ser un arreglo JSON.',
        status: 400,
      });
    }
  }

  const receiptImage = req.file ? `${req.file.filename}` : null;

  if (!items || !Array.isArray(items) || items.length === 0 || !buyerId || !paymentMethod) {
    return responser.error({
      res,
      message: 'Campos requeridos: items (arreglo), ID del comprador, método de pago',
      status: 400,
    });
  }

  // Get the current daily rate from config
  let dailyRate;
  try {
    const configs = await configService.getAllConfigs();
    if (configs.length === 0) {
      dailyRate = 1; // Default or handle error
    } else {
      dailyRate = configs[0].dolarRate;
    }
  } catch (error) {
    dailyRate = 1;
  }

  // Convert shippingCost to number and handle empty/undefined values
  const calculatedShippingCost = parseFloat(shippingCost) || 0;

  // Get paymentMethodId from paymentMethod name first
  let paymentMethodId = null;
  if (paymentMethod) {
    const paymentMethodObj = await models.PaymentMethod.findOne({
      where: { name: paymentMethod }
    });
    if (paymentMethodObj) {
      paymentMethodId = paymentMethodObj.id;
    }
  }
  
  // Get all product IDs from items
  const productIds = items.map(item => item.productId);
  
  // Get products with their details to calculate prices with discounts
  const products = await models.Product.findAll({
    where: { id: productIds },
    attributes: ['id', 'price', 'discount']
  });
  
  // Create a map for quick product lookup
  const productMap = new Map();
  products.forEach(product => {
    productMap.set(product.id, product);
  });
  
  // Calculate subtotal for the order
  let subtotal = 0;
  const salesData = items.map(item => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }
    
    // Calculate discount and unit price
    const discountPercent = parseFloat(product.discount) || 0;
    const originalPrice = parseFloat(product.price);
    const discountAmount = (originalPrice * discountPercent) / 100;
    const unitPriceWithDiscount = originalPrice - discountAmount;
    
    // Calculate subtotal for this item
    const itemSubtotal = unitPriceWithDiscount * item.quantity;
    subtotal += itemSubtotal;
    
    return {
      dailyRate,
      quantity: item.quantity,
      status: 'pending', // For backward compatibility
      orderId: null, // Will be set after order creation
      buyerId,
      paymentMethod,
      paymentMethodId,
      referenceNumber,
      receiptImage,
      productId: item.productId,
      discount: discountPercent,
      unitPrice: unitPriceWithDiscount,
      originalPrice: originalPrice,
      saleDate: new Date()
    };
  });
  
  // Calculate total including shipping cost
  const total = subtotal + calculatedShippingCost;

  // Get user data to use as default if client info is not provided
  let defaultClientInfo = {};
  if (buyerId) {
    try {
      const user = await models.User.findByPk(buyerId, {
        attributes: ['name', 'email', 'phone']
      });
      if (user) {
        defaultClientInfo = {
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: user.phone
        };
      }
    } catch (error) {
      console.error('Error fetching user data for default client info:', error);
    }
  }

  // Step 1: Create an Order record for this checkout with total amount
  const order = await orderService.createOrder({
    status: 'pending',
    buyerId,
    clientName: clientName || defaultClientInfo.clientName || '',
    clientEmail: clientEmail || defaultClientInfo.clientEmail || '',
    clientPhone: clientPhone || defaultClientInfo.clientPhone || '',
    shippingCost: calculatedShippingCost,
    total: total, // Total including shipping
    paymentMethodId,
    paymentMethod,
    shippingMethod: shippingMethod || 'standard', // Guardar el nombre del método de pago en el campo shippingMethod
    shippingAddress: shippingAddress || '' // Use received shipping address
  });
  
  // Set the orderId for all sales
  const salesWithOrderId = salesData.map(sale => ({
    ...sale,
    orderId: order.id
  }));

  // Step 2: Create the Sale records with the orderId set to the newly created Order's id
  const newSales = await saleService.createMultipleSales(salesWithOrderId);
  responser.success({
    res,
    message: 'Checkout realizado con éxito',
    body: { 
      order: { ...order.dataValues, sales: newSales }, // Return the Order with its associated Sales
      sales: newSales 
    },
  });
});

const getStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const sales = await saleService.getStats(startDate, endDate);
  const users = await userService.getAllUsers();
  const visitsCount = await visitService.getVisitsCount(startDate, endDate);
  
  // Total sales calculation using unitPrice (with discount applied)
  const totalSales = sales.reduce((acc, sale) => {
    const price = sale.unitPrice || sale.product?.price || 0;
    return acc + (Number(price) * Number(sale.quantity));
  }, 0);

  responser.success({
    res,
    body: {
      salesCount: sales.length,
      totalSales: totalSales, // Keep for backward compatibility if needed
      totalRevenue: totalSales,
      usersCount: users.length,
      visitsCount: visitsCount,
      salesData: sales.map(s => ({
        date: s.createdAt,
        amount: Number(s.unitPrice || s.product?.price || 0) * Number(s.quantity)
      }))
    },
  });
});

const uploadReceipt = asyncHandler(async (req, res) => {
  let { saleIds } = req.body;

  if (typeof saleIds === 'string') {
    try {
      saleIds = JSON.parse(saleIds);
    } catch (error) {
      return responser.error({
        res,
        message: 'Formato de saleIds inválido. Debe ser un arreglo JSON.',
        status: 400,
      });
    }
  }

  if (!saleIds || !Array.isArray(saleIds) || saleIds.length === 0) {
    return responser.error({
      res,
      message: 'Campo requerido: saleIds (arreglo)',
      status: 400,
    });
  }

  if (!req.file) {
    return responser.error({
      res,
      message: 'No se subió ninguna imagen del comprobante',
      status: 400,
    });
  }

  const receiptImage = `${req.file.filename}`;

  // Update all sales in the list
  const updatePromises = saleIds.map(id => 
    saleService.updateSale(id, { receiptImage })
  );

  await Promise.all(updatePromises);

  responser.success({
    res,
    message: 'Comprobante subido con éxito',
    body: { receiptImage },
  });
});

export {
  getSales,
  getSale,
  getSalesByUserId,
  createSale,
  updateSale,
  deleteSale,
  createCheckout,
  uploadReceipt,
  getStats
};

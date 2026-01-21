import saleService from '../services/sale.service.js';
import userService from '../services/user.service.js';
import visitService from '../services/visit.service.js';
import configService from '../services/config.service.js';
import responser from './responser.js';

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
  if (!userId) {
    return responser.error({
      res,
      message: 'User ID is required',
      status: 400,
    });
  }
  const sales = await saleService.getSalesByUserId(userId);
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
      message: 'Required fields: quantity, buyerId, paymentMethod, productId',
      status: 400,
    });
  }

  if (quantity <= 0) {
    return responser.error({
      res,
      message: 'Quantity must be greater than 0',
      status: 400,
    });
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return responser.error({
      res,
      message: 'Rating must be between 1 and 5',
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
        message: 'No configuration found. Please set up the daily rate first.',
        status: 400,
      });
    }
    // Use the most recent config (first in the array since ordered by createdAt DESC)
    dailyRate = configs[0].dolarRate;
  } catch (error) {
    return responser.error({
      res,
      message: 'Failed to get daily rate from configuration',
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
    message: 'Sale created successfully',
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
      message: 'Quantity must be greater than 0',
      status: 400,
    });
  }

  if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
    return responser.error({
      res,
      message: 'Rating must be between 1 and 5',
      status: 400,
    });
  }

  const updatedSale = await saleService.updateSale(id, updateData);
  responser.success({
    res,
    message: 'Sale updated successfully',
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
    paymentMethod,
    referenceNumber
  } = req.body;

  // If items is sent as a string (common with FormData), parse it
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (error) {
      return responser.error({
        res,
        message: 'Invalid items format. Must be a JSON array.',
        status: 400,
      });
    }
  }

  const receiptImage = req.file ? `${req.file.filename}` : null;

  if (!items || !Array.isArray(items) || items.length === 0 || !buyerId || !paymentMethod) {
    return responser.error({
      res,
      message: 'Required fields: items (array), buyerId, paymentMethod',
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

  const salesData = items.map(item => ({
    dailyRate,
    quantity: item.quantity,
    status: 'pending', 
    buyerId,
    paymentMethod,
    referenceNumber,
    receiptImage,
    productId: item.productId,
    saleDate: new Date()
  }));

  const newSales = await saleService.createMultipleSales(salesData);
  responser.success({
    res,
    message: 'Checkout successful',
    body: { sales: newSales },
  });
});

const getStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const sales = await saleService.getStats(startDate, endDate);
  const users = await userService.getAllUsers();
  const visitsCount = await visitService.getVisitsCount(startDate, endDate);
  
  // Total sales calculation (price * quantity)
  const totalSales = sales.reduce((acc, sale) => {
    const price = sale.product?.price || 0;
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
        amount: Number(s.product?.price || 0) * Number(s.quantity)
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
        message: 'Invalid saleIds format. Must be a JSON array.',
        status: 400,
      });
    }
  }

  if (!saleIds || !Array.isArray(saleIds) || saleIds.length === 0) {
    return responser.error({
      res,
      message: 'Required field: saleIds (array)',
      status: 400,
    });
  }

  if (!req.file) {
    return responser.error({
      res,
      message: 'No receipt image uploaded',
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
    message: 'Receipt uploaded successfully',
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

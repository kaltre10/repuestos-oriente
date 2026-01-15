import saleService from '../services/sale.service.js';
import configService from '../services/config.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getSales = asyncHandler(async (req, res) => {
  const sales = await saleService.getAllSales();
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

const createSale = asyncHandler(async (req, res) => {
  const {
    quantity,
    status,
    buyer,
    paymentMethod,
    saleDate,
    productId,
    rating
  } = req.body;

  // Validation
  if (!quantity || !buyer || !paymentMethod || !productId) {
    return responser.error({
      res,
      message: 'Required fields: quantity, buyer, paymentMethod, productId',
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
    buyer,
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

export {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale
};

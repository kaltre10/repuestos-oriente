import productService from '../services/product.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  console.log('Fetching all products');
  responser.success({
    res,
    body: { products },
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  responser.success({
    res,
    body: { product },
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    model,
    brandId,
    modelId,
    productBrand,
    categories,
    subcategories,
    years,
    description,
    discount,
    amount,
    price,
    freeDelivery,
    partNumber
  } = req.body;

  // Validation
  if (!name || !productBrand || !categories || !years || !price || !partNumber) {
    return responser.error({
      res,
      message: 'Required fields: name, productBrand, categories, years, price, partNumber',
      status: 400,
    });
  }

  if (amount === undefined || amount < 0) {
    return responser.error({
      res,
      message: 'Amount must be a non-negative number',
      status: 400,
    });
  }

  if (price <= 0) {
    return responser.error({
      res,
      message: 'Price must be greater than 0',
      status: 400,
    });
  }

  const productData = {
    name,
    brand: brand || null,
    model: model || null,
    brandId: brandId || null,
    modelId: modelId || null,
    productBrand,
    categories,
    subcategories: subcategories || '',
    years,
    description,
    discount: discount || 0,
    amount: amount || 0,
    price,
    freeDelivery: freeDelivery || false,
    partNumber
  };

  const newProduct = await productService.createProduct(productData);
  responser.success({
    res,
    message: 'Product created successfully',
    body: { product: newProduct },
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    brand,
    model,
    brandId,
    modelId,
    productBrand,
    categories,
    subcategories,
    years,
    description,
    discount,
    amount,
    price,
    freeDelivery,
    partNumber
  } = req.body;

  // Validation for price if provided
  if (price !== undefined && price <= 0) {
    return responser.error({
      res,
      message: 'Price must be greater than 0',
      status: 400,
    });
  }

  const updateData = {
    name,
    brand: brand !== undefined ? (brand || null) : undefined,
    model: model !== undefined ? (model || null) : undefined,
    brandId: brandId !== undefined ? (brandId || null) : undefined,
    modelId: modelId !== undefined ? (modelId || null) : undefined,
    productBrand,
    categories,
    subcategories: subcategories !== undefined ? (subcategories || '') : undefined,
    years,
    description,
    discount,
    amount,
    price,
    freeDelivery,
    partNumber
  };

  // Validation for amount if provided
  if (amount !== undefined && amount < 0) {
    return responser.error({
      res,
      message: 'Amount must be a non-negative number',
      status: 400,
    });
  }

  const updatedProduct = await productService.updateProduct(id, updateData);
  responser.success({
    res,
    message: 'Product updated successfully',
    body: { product: updatedProduct },
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await productService.deleteProduct(id);
  responser.success({
    res,
    message: result.message,
  });
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

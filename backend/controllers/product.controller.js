import productService from '../services/product.service.js';
import responser from './responser.js';
import jwt from 'jsonwebtoken';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper to check if requester is admin (optional token)
const isAdminRequest = (req) => {
  try {
    const authorization = req.headers.authorization || '';
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return false;
    }
    const token = authorization.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded && decoded.role === 'admin';
  } catch (error) {
    return false;
  }
};

const getProducts = asyncHandler(async (req, res) => {
  const { year, onSale, page, limit, sortBy, search, showInactive } = req.query;
  const isAdmin = isAdminRequest(req);
  
  const { products, pagination } = await productService.getAllProducts({ 
    year, 
    onSale, 
    page: parseInt(page) || 1, 
    limit: parseInt(limit) || 20,
    sortBy,
    search,
    isAdmin: isAdmin && showInactive === 'true' // Only show inactive if admin AND explicitly requested
  });
  responser.success({
    res,
    body: { products, pagination },
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isAdmin = isAdminRequest(req);
  const product = await productService.getProductById(id);

  // If not admin and product is inactive, don't show it
  if (!isAdmin && product && !product.isActive) {
    return responser.error({
      res,
      message: 'Producto no disponible',
      status: 404,
    });
  }

  responser.success({
    res,
    body: { product },
  });
});

const createProduct = asyncHandler(async (req, res) => {
  // console.log('--- CREATE PRODUCT START ---');
  // console.log('Body recibido:', JSON.stringify(req.body, null, 2));
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
    partNumber,
    garantia,
    isActive
  } = req.body;

  // Validation
  if (!name || !productBrand || !categories || !years || !price || !partNumber) {
    console.warn('createProduct: Error de validación - Campos faltantes');
    return responser.error({
      res,
      message: 'Campos requeridos: nombre, marca del producto, categorías, años, precio, número de parte',
      status: 400,
    });
  }

  if (amount === undefined || amount < 0) {
    console.warn('createProduct: Error de validación - Cantidad inválida:', amount);
    return responser.error({
      res,
      message: 'La cantidad debe ser un número no negativo',
      status: 400,
    });
  }

  if (price <= 0) {
    console.warn('createProduct: Error de validación - Precio inválido:', price);
    return responser.error({
      res,
      message: 'El precio debe ser mayor a 0',
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
    partNumber,
    garantia: garantia || null,
    isActive: isActive !== undefined ? isActive : true
  };

  console.log('createProduct: Llamando a productService.createProduct con:', JSON.stringify(productData, null, 2));
  const newProduct = await productService.createProduct(productData);
  console.log('createProduct: Producto creado con éxito:', newProduct.id);
  responser.success({
    res,
    message: 'Producto creado con éxito',
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
    partNumber,
    garantia,
    isActive
  } = req.body;

  // Validation for price if provided
  if (price !== undefined && price <= 0) {
    return responser.error({
      res,
      message: 'El precio debe ser mayor a 0',
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
    partNumber,
    garantia,
    isActive
  };

  // Validation for amount if provided
  if (amount !== undefined && amount < 0) {
    return responser.error({
      res,
      message: 'La cantidad debe ser un número no negativo',
      status: 400,
    });
  }

  const updatedProduct = await productService.updateProduct(id, updateData);
  responser.success({
    res,
    message: 'Producto actualizado con éxito',
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

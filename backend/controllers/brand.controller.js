import brandService from '../services/brand.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getBrands = asyncHandler(async (req, res) => {
  const brands = await brandService.getAllBrands();
  responser.success({
    res,
    body: { brands },
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await brandService.getBrandById(id);
  responser.success({
    res,
    body: { brand },
  });
});

const createBrand = asyncHandler(async (req, res) => {
  const { brand } = req.body;

  if (!brand) {
    return responser.error({
      res,
      message: 'Brand name is required',
      status: 400,
    });
  }

  const newBrand = await brandService.createBrand({ brand });
  responser.success({
    res,
    message: 'Brand created successfully',
    body: { brand: newBrand },
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { brand } = req.body;

  if (!brand) {
    return responser.error({
      res,
      message: 'Brand name is required',
      status: 400,
    });
  }

  const updatedBrand = await brandService.updateBrand(id, { brand });
  responser.success({
    res,
    message: 'Brand updated successfully',
    body: { brand: updatedBrand },
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await brandService.deleteBrand(id);
  responser.success({
    res,
    message: result.message,
  });
});

export {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
};

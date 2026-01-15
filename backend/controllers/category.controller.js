import categoryService from '../services/category.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  responser.success({
    res,
    body: { categories },
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(id);
  responser.success({
    res,
    body: { category },
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return responser.error({
      res,
      message: 'Category name is required',
      status: 400,
    });
  }

  const newCategory = await categoryService.createCategory({ category });
  responser.success({
    res,
    message: 'Category created successfully',
    body: { category: newCategory },
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) {
    return responser.error({
      res,
      message: 'Category name is required',
      status: 400,
    });
  }

  const updatedCategory = await categoryService.updateCategory(id, { category });
  responser.success({
    res,
    message: 'Category updated successfully',
    body: { category: updatedCategory },
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(id);
  responser.success({
    res,
    message: result.message,
  });
});

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};

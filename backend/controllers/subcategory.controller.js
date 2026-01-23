import subCategoryService from '../services/subcategory.service.js';
import responser from './responser.js';

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await subCategoryService.getAllSubCategories();
  responser.success({
    res,
    body: { subCategories },
  });
});

const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const subCategories = await subCategoryService.getSubCategoriesByCategoryId(categoryId);
  responser.success({
    res,
    body: { subCategories },
  });
});

const getSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subCategory = await subCategoryService.getSubCategoryById(id);
  responser.success({
    res,
    body: { subCategory },
  });
});

const createSubCategory = asyncHandler(async (req, res) => {
  const { subCategory, categoryId } = req.body;

  if (!subCategory || !categoryId) {
    return responser.error({
      res,
      message: 'El nombre de la subcategoría y el ID de la categoría son requeridos',
      status: 400,
    });
  }

  const newSubCategory = await subCategoryService.createSubCategory({ subCategory, categoryId });
  responser.success({
    res,
    message: 'Subcategoría creada con éxito',
    body: { subCategory: newSubCategory },
  });
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subCategory, categoryId } = req.body;

  if (!subCategory && !categoryId) {
    return responser.error({
      res,
      message: 'Se requiere al menos un campo (subCategoría o ID de categoría) para actualizar',
      status: 400,
    });
  }

  const updatedSubCategory = await subCategoryService.updateSubCategory(id, { subCategory, categoryId });
  responser.success({
    res,
    message: 'Subcategoría actualizada con éxito',
    body: { subCategory: updatedSubCategory },
  });
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await subCategoryService.deleteSubCategory(id);
  responser.success({
    res,
    message: result.message,
  });
});

export {
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
};

import express from 'express';
import { 
  getSubCategories, 
  getSubCategoriesByCategory, 
  getSubCategory, 
  createSubCategory, 
  updateSubCategory, 
  deleteSubCategory 
} from '../controllers/subcategory.controller.js';
import responser from '../controllers/responser.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Subcategory API is working' });
});

router.get('/subcategories', getSubCategories);
router.get('/subcategories/category/:categoryId', getSubCategoriesByCategory);
router.get('/subcategories/:id', getSubCategory);
router.post('/subcategories', createSubCategory);
router.put('/subcategories/:id', updateSubCategory);
router.delete('/subcategories/:id', deleteSubCategory);

export default router;

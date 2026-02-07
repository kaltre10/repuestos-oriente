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
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Subcategory API is working' });
});

router.get('/subcategories', getSubCategories);
router.get('/subcategories/category/:categoryId', getSubCategoriesByCategory);
router.get('/subcategories/:id', getSubCategory);

router.post('/subcategories', [validateToken, onlyAdmin], createSubCategory);
router.put('/subcategories/:id', [validateToken, onlyAdmin], updateSubCategory);
router.delete('/subcategories/:id', [validateToken, onlyAdmin], deleteSubCategory);

export default router;

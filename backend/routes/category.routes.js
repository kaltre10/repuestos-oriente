import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import responser from '../controllers/responser.js';
import validateToken from '../midelwares/validateToken.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Category API is working' });
});
router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.use(validateToken);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;

import express from 'express';
import { getModels, getModel, createModel, updateModel, deleteModel } from '../controllers/model.controller.js';
import responser from '../controllers/responser.js';
import validateToken from '../midelwares/validateToken.js';

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Model API is working' });
});

router.get('/models', getModels);
router.get('/models/:id', getModel);

router.use(validateToken);

router.post('/models', createModel);
router.put('/models/:id', updateModel);
router.delete('/models/:id', deleteModel);

export default router;

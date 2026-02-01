import express from 'express';
import { getModels, getModel, createModel, updateModel, deleteModel } from '../controllers/model.controller.js';
import responser from '../controllers/responser.js';
import validateToken from "../midelwares/validateToken.js";

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Model API is working' });
});

router.get('/models', getModels);
router.get('/models/:id', getModel);

router.post('/models', validateToken, createModel);
router.put('/models/:id', validateToken, updateModel);
router.delete('/models/:id', validateToken, deleteModel);

export default router;

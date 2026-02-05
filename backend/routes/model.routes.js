import express from 'express';
import { getModels, getModel, createModel, updateModel, deleteModel } from '../controllers/model.controller.js';
import responser from '../controllers/responser.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = express.Router();

router.get('/', (_req, res) => {
  responser.success({ res, message: 'Model API is working' });
});

router.get('/models', getModels);
router.get('/models/:id', getModel);

router.post('/models', [validateToken, onlyAdmin], createModel);
router.put('/models/:id', [validateToken, onlyAdmin], updateModel);
router.delete('/models/:id', [validateToken, onlyAdmin], deleteModel);

export default router;

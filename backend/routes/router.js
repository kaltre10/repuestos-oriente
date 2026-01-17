import express from 'express';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import brandRoutes from './brand.routes.js';
import categoryRoutes from './category.routes.js';
import modelRoutes from './model.routes.js';
import imageRoutes from './image.routes.js';
import saleRoutes from './sale.routes.js';
import configRoutes from './config.routes.js';

const router = express.Router();

// API versioning
const apiVersion = '/api/v1';

// Mount all route modules
router.use(apiVersion, userRoutes);
router.use(apiVersion, productRoutes);
router.use(apiVersion, brandRoutes);
router.use(apiVersion, categoryRoutes);
router.use(apiVersion, modelRoutes);
router.use(apiVersion, imageRoutes);
router.use(apiVersion, saleRoutes);
router.use(apiVersion, configRoutes);

export default router;

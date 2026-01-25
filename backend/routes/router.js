import express from 'express';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import brandRoutes from './brand.routes.js';
import categoryRoutes from './category.routes.js';
import subcategoryRoutes from './subcategory.routes.js';
import modelRoutes from './model.routes.js';
import imageRoutes from './image.routes.js';
import saleRoutes from './sale.routes.js';
import configRoutes from './config.routes.js';
import questionRoutes from './question.routes.js';
import visitRoutes from './visit.routes.js';
import paymentMethodRoutes from './paymentmethod.routes.js';
import sliderRoutes from './slider.routes.js';
import advertisingRoutes from './advertising.routes.js';
import contactRoutes from './contact.routes.js';

const router = express.Router();

// API versioning
const apiVersion = '/api/v1';

// Mount all route modules
router.use(apiVersion, userRoutes);
router.use(apiVersion, productRoutes);
router.use(apiVersion, brandRoutes);
router.use(apiVersion, categoryRoutes);
router.use(apiVersion, subcategoryRoutes);
router.use(apiVersion, modelRoutes);
router.use(apiVersion, imageRoutes);
router.use(`${apiVersion}/sales`, saleRoutes);
router.use(apiVersion, configRoutes);
router.use(`${apiVersion}/questions`, questionRoutes);
router.use(`${apiVersion}/visits`, visitRoutes);
router.use(`${apiVersion}/payment-methods`, paymentMethodRoutes);
router.use(`${apiVersion}/sliders`, sliderRoutes);
router.use(`${apiVersion}/advertising`, advertisingRoutes);
router.use(`${apiVersion}/contact`, contactRoutes);

export default router;

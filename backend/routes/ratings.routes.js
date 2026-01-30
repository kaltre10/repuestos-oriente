//ratings route

import express from 'express';
import { createRating } from '../controllers/ratings.controller.js';
import validateToken from '../midelwares/validateToken.js';

import responser from '../controllers/responser.js';

const router = express.Router();

router.get('/', (_req, res) => {
    responser.success({ res, message: 'Ratings API is working' });
});

router.post('/ratings', validateToken, createRating);

export default router;
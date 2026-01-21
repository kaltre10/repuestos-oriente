import express from 'express';
import { recordVisit, getVisitsStats } from '../controllers/visit.controller.js';

const router = express.Router();

router.post('/', recordVisit);
router.get('/stats', getVisitsStats);

export default router;

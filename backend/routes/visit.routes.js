import express from 'express';
import { recordVisit, getVisitsStats } from '../controllers/visit.controller.js';
import validateToken from '../midelwares/validateToken.js';
import onlyAdmin from '../midelwares/onlyAdmin.js';

const router = express.Router();

router.post('/', recordVisit);
router.get('/stats', [validateToken, onlyAdmin], getVisitsStats);

export default router;

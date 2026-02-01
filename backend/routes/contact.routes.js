import { Router } from 'express';
import contactController from '../controllers/contact.controller.js';
import validateToken from "../midelwares/validateToken.js";

const router = Router();

router.post('/', validateToken, contactController.sendContact);

export default router;

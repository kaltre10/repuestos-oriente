import express from 'express';
import { 
  createQuestion, 
  getQuestionsByProduct, 
  getQuestionsByClient,
  getAllQuestions, 
  answerQuestion 
} from '../controllers/question.controller.js';
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = express.Router();

router.get('/product/:productId', getQuestionsByProduct);
router.get('/client/:clientId', validateToken, getQuestionsByClient);
router.get('/all', [validateToken, onlyAdmin], getAllQuestions);

router.put('/:id/answer', [validateToken, onlyAdmin], answerQuestion);
router.post('/', validateToken, createQuestion);

export default router;

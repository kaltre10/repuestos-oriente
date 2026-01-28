import express from 'express';
import { 
  createQuestion, 
  getQuestionsByProduct, 
  getQuestionsByClient,
  getAllQuestions, 
  answerQuestion 
} from '../controllers/question.controller.js';
import validateToken from '../midelwares/validateToken.js';

const router = express.Router();

router.get('/product/:productId', getQuestionsByProduct);
router.get('/client/:clientId', getQuestionsByClient);
router.get('/all', getAllQuestions);
router.use(validateToken);
router.put('/:id/answer', answerQuestion);
router.post('/', createQuestion);

export default router;

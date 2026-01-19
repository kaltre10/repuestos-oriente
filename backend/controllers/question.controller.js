import questionService from '../services/question.service.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const createQuestion = asyncHandler(async (req, res) => {
  const { productId, questionText, clientId } = req.body;

  if (!productId || !questionText || !clientId) {
    return responser.error({
      res,
      message: 'Product ID, Question text and Client ID are required',
      status: 400
    });
  }

  const question = await questionService.createQuestion({
    productId,
    questionText,
    clientId,
    status: 0
  });

  responser.success({
    res,
    message: 'Question created successfully',
    body: { question }
  });
});

export const getQuestionsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const questions = await questionService.getQuestionsByProduct(productId);

  responser.success({
    res,
    body: { questions }
  });
});

export const getQuestionsByClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const questions = await questionService.getQuestionsByClient(clientId);

  responser.success({
    res,
    body: { questions }
  });
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await questionService.getAllQuestions();

  responser.success({
    res,
    body: { questions }
  });
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answerText } = req.body;

  if (!answerText) {
    return responser.error({
      res,
      message: 'Answer text is required',
      status: 400
    });
  }

  const question = await questionService.answerQuestion(id, answerText);

  responser.success({
    res,
    message: 'Question answered successfully',
    body: { question }
  });
});

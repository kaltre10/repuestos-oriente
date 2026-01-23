import models from '../models/index.js';
const { Question, Product, User, ProductImage } = models;

class QuestionService {
  async createQuestion(data) {
    try {
      return await Question.create(data);
    } catch (error) {
      throw new Error(`Error al crear la pregunta: ${error.message}`);
    }
  }

  async getQuestionsByProduct(productId) {
    try {
      return await Question.findAll({
        where: { productId },
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name', 'profilePicture']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Error al obtener preguntas por producto: ${error.message}`);
    }
  }

  async getQuestionsByClient(clientId) {
    try {
      return await Question.findAll({
        where: { clientId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name'],
            include: [
              {
                model: ProductImage,
                as: 'images',
                attributes: ['image'],
                limit: 1
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Error al obtener preguntas por cliente: ${error.message}`);
    }
  }

  async getAllQuestions() {
    try {
      return await Question.findAll({
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name']
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name'],
            include: [
              {
                model: ProductImage,
                as: 'images',
                attributes: ['image'],
                limit: 1
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Error al obtener todas las preguntas: ${error.message}`);
    }
  }

  async answerQuestion(id, answerText) {
    try {
      const question = await Question.findByPk(id);
      if (!question) {
        throw new Error('Pregunta no encontrada');
      }
      return await question.update({
        answerText,
        status: 1
      });
    } catch (error) {
      throw new Error(`Error al responder la pregunta: ${error.message}`);
    }
  }
}

export default new QuestionService();

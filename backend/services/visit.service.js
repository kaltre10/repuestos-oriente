import models from '../models/index.js';
const { Visit } = models;
import { Op } from 'sequelize';

class VisitService {
  async recordVisit(visitData) {
    try {
      const visit = await Visit.create(visitData);
      return visit;
    } catch (error) {
      throw new Error(`Failed to record visit: ${error.message}`);
    }
  }

  async getVisitsCount(startDate, endDate) {
    try {
      const where = {};
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      const count = await Visit.count({ where });
      return count;
    } catch (error) {
      throw new Error(`Failed to get visits count: ${error.message}`);
    }
  }
}

export default new VisitService();

import visitService from '../services/visit.service.js';
import responser from './responser.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const recordVisit = asyncHandler(async (req, res) => {
  const { path } = req.body;
  const visitData = {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    path: path || '/'
  };

  await visitService.recordVisit(visitData);

  responser.success({
    res,
    message: 'Visita registrada con éxito',
  });
});

const getVisitsStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const count = await visitService.getVisitsCount(startDate, endDate);

  responser.success({
    res,
    body: { count },
  });
});

export {
  recordVisit,
  getVisitsStats
};

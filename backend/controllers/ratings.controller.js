import responser from './responser.js';
import ratingService from '../services/rating.service.js';

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const createRating = asyncHandler(async (req, res) => {
    const { rating, orderId } = req.body;
    const clientId = req.user.id;
    // Assuming validateToken middleware adds user info to req
    if (!rating || !orderId) {
        return responser.error({
            res,
            message: 'Rating and Order ID are required',
            status: 400
        });
    }

    const newRating = await ratingService.createRating({
        rating,
        orderId,
        clientId
    });

    responser.success({
        res,
        message: 'Gracias por calificar su compra',
        body: { rating: newRating }
    });
});


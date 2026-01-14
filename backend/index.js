import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import globalErrorHandler from './utils/globalErrors.js';
import { corsOptions, startServer } from './utils/utils.js';
import responser from './controllers/responser.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  responser.success({ res, message: 'API is working' });
});

app.use('/api/v1', userRoutes);

app.use((_, res) => {
  responser.error({
    res,
    message: 'Route not found',
    status: 404
  });
});

app.use(globalErrorHandler);

startServer(app);

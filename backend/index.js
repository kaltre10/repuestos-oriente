import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import globalErrorHandler from './utils/globalErrors.js';
import { corsOptions, startServer } from './utils/utils.js';
import responser from './controllers/responser.js';
import morgan from 'morgan';

import router from './routes/router.js';

const app = express();

app.use(morgan('dev'));

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use('/images', express.static('images'));

app.get('/', (_, res) => {
  responser.success({ res, message: 'API is working' });
});

app.use(router);

app.use((_, res) => {
  responser.error({
    res,
    message: 'Route not found',
    status: 404
  });
});

app.use(globalErrorHandler);

startServer(app);

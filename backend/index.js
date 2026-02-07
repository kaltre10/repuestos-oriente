import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './utils/globalErrors.js';
import { corsOptions, startServer } from './utils/utils.js';
import responser from './controllers/responser.js';
import morgan from 'morgan';

// Configurar zona horaria de Venezuela
process.env.TZ = 'America/Caracas';

import router from './routes/router.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar trust proxy para obtener la IP real detrás de cPanel/Nginx
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Permitir cargar imágenes desde el backend en el frontend
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // limit each IP to 3000 requests per windowMs
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Excluir el endpoint del cron del rate limiting
    return req.path.includes('/update-dolar-bcv');
  },
  // Manejador personalizado para evitar crasheos por headers ya enviados
  handler: (req, res, next, options) => {
    if (!res.headersSent) {
      res.status(options.statusCode).json(options.message);
    }
  }
});

// Apply rate limiter to all routes
app.use(limiter);

app.use(morgan('dev'));

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

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

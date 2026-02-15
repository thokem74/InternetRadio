import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import radioRoutes from './routes/radioRoutes.js';

export function createApp() {
  const app = express();

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use('/api', apiLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', radioRoutes);
  app.use(errorHandler);

  return app;
}

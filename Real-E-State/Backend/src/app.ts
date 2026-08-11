import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import type {} from './common/types/express';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(env.apiPrefix, routes);

app.use(errorMiddleware);

export default app;

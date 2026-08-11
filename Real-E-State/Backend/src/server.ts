import http from 'http';

import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import logger from './config/logger';
import { initializeSocket } from './services/socket.service';

const bootstrap = async () => {
  try {
    await connectDatabase();

    const server = http.createServer(app);
    initializeSocket(server);

    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);

    process.exit(1);
  }
};

bootstrap();

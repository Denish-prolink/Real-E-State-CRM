import mongoose from 'mongoose';

import { env } from './env';
import logger from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('MongoDB Connection Failed: ', error);

    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB Disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB Reconnected');
});

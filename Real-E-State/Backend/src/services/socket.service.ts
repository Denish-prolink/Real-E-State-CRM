import type { Server as HttpServer } from 'http';

import { Server as SocketServer } from 'socket.io';

import logger from '../config/logger';

let io: SocketServer | null = null;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: (origin, callback) => {
        // Dynamically allow any origin to prevent CORS issues with credentials/wildcards
        callback(null, origin || true);
      },
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Socket client connected: ${socket.id}`);

    // Join a company room so notifications are scoped per company
    socket.on('join_company', (companyId: string) => {
      if (companyId) {
        socket.join(companyId);
        logger.info(`Socket ${socket.id} joined company room: ${companyId}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

// Helper to notify a specific company's clients
export const notifyCompany = (companyId: string, event: string, data?: Record<string, unknown>) => {
  if (io && companyId) {
    io.to(companyId).emit(event, data || {});
    logger.info(`Broadcasted event "${event}" to company room: ${companyId}`);
  }
};

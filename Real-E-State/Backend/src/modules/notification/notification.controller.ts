import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as notificationService from './notification.service';

export const getLowStockNotification = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const userId = req.user?.userId as string;
  const { products, count } = await notificationService.getLowStockProducts(agencyId, userId);

  return successResponse(res, 'Low stock notifications fetched successfully', {
    count,
    products,
  });
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const userId = req.user?.userId as string;
  const productId = req.params.id as string;
  
  await notificationService.markNotificationAsRead(agencyId, userId, productId);
  
  return successResponse(res, 'Notification marked as read successfully');
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const userId = req.user?.userId as string;
  
  await notificationService.markAllNotificationsAsRead(agencyId, userId);
  
  return successResponse(res, 'All notifications marked as read successfully');
};

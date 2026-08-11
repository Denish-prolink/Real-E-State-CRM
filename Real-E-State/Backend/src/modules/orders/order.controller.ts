import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import * as service from './order.service';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const order = await service.createOrder({ ...req.body, companyId });
  return successResponse(res, 'Order created successfully', order, 201);
};

export const createSellOrder = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  req.body.orderType = 'sell';
  const order = await service.createOrder({ ...req.body, companyId });
  return successResponse(res, 'Sell order created successfully', order, 201);
};

export const createPurchaseOrder = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  req.body.orderType = 'purchase';
  const order = await service.createOrder({ ...req.body, companyId });
  return successResponse(res, 'Purchase order created successfully', order, 201);
};

export const getSellOrders = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage as string) || 10));
  const search = (req.query.search as string) || undefined;

  const orders = await service.getOrders(companyId, page, perPage, 'sell', search);
  return successResponse(res, 'Sell orders retrieved successfully', orders);
};

export const getPurchaseOrders = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage as string) || 10));
  const search = (req.query.search as string) || undefined;

  const orders = await service.getOrders(companyId, page, perPage, 'purchase', search);
  return successResponse(res, 'Purchase orders retrieved successfully', orders);
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(req.query.perPage as string) || 10));
  const orderType = (req.query.orderType as string) || undefined;
  const search = (req.query.search as string) || undefined;

  const orders = await service.getOrders(companyId, page, perPage, orderType, search);
  return successResponse(res, 'Orders retrieved successfully', orders);
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const order = await service.getOrderById(req.params.id as string, companyId);
  return successResponse(res, 'Order retrieved successfully', order);
};

export const updateOrder = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const order = await service.updateOrder(req.params.id as string, req.body, companyId);
  return successResponse(res, 'Order updated successfully', order);
};

export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await service.deleteOrder(req.params.id as string, companyId);
  return successResponse(res, 'Order deleted successfully');
};

import mongoose from 'mongoose';

import { Order } from '../orders/order.model';
import { Product } from '../products/product.model';

export const getProfitLossData = async (agencyId: string) => {
  const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

  // Aggregate sell orders
  const sellResult = await Order.aggregate([
    { $match: { agencyId: agencyObjectId, orderType: 'sell', status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$finalPrice' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  // Aggregate purchase orders
  const buyResult = await Order.aggregate([
    { $match: { agencyId: agencyObjectId, orderType: 'purchase', status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalCost: { $sum: '$finalPrice' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = sellResult[0]?.totalRevenue || 0;
  const totalCost = buyResult[0]?.totalCost || 0;
  const netProfit = totalRevenue - totalCost;

  return {
    totalRevenue,
    totalCost,
    netProfit,
    sellOrdersCount: sellResult[0]?.totalOrders || 0,
    buyOrdersCount: buyResult[0]?.totalOrders || 0,
  };
};

export const getProductsReportData = async (agencyId: string) => {
  const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

  const result = await Product.aggregate([
    { $match: { agencyId: agencyObjectId } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalInventoryValue: { $sum: { $multiply: ['$quantity', '$rawPrice'] } },

      },
    },
  ]);

  const categoriesResult = await Product.aggregate([
    { $match: { agencyId: agencyObjectId } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return {
    summary: result[0] || {
      totalProducts: 0,
      totalQuantity: 0,
      totalInventoryValue: 0,
    },
    byCategory: categoriesResult,
  };
};

export const getSellReportData = async (agencyId: string) => {
  const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

  const result = await Order.aggregate([
    { $match: { agencyId: agencyObjectId, orderType: 'sell' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$finalPrice' },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  return result;
};

export const getBuyReportData = async (agencyId: string) => {
  const agencyObjectId = new mongoose.Types.ObjectId(agencyId);

  const result = await Order.aggregate([
    { $match: { agencyId: agencyObjectId, orderType: 'purchase' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        cost: { $sum: '$finalPrice' },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  return result;
};

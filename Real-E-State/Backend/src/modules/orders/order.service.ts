import { ApiError } from '../../common/exceptions/ApiError';
import { Product } from '../products/product.model';
import { Warehouse } from '../warehouses/warehouse.model';

import type { IOrder } from './order.model';
import * as repository from './order.repository';

export const createOrder = async (data: Partial<IOrder> & { agencyId: string | undefined }) => {
  const agencyId = data.agencyId;
  if (data.items && data.items.length > 0) {
    if (data.orderType === 'sell') {
      for (const item of data.items) {
        const product = await Product.findOne({ _id: item.product, agencyId });
        if (!product) {
          throw new ApiError('Product not found', 404);
        }
        if (product.quantity < item.quantity) {
          throw new ApiError(
            `Insufficient stock for product: ${product.title || 'Unknown'}. Available: ${product.quantity}, Required: ${item.quantity}`,
            400,
          );
        }
      }
    }

    if (data.orderType === 'purchase') {
      const warehouseQtys: Record<string, number> = {};
      for (const item of data.items) {
        const whId = item.warehouse.toString();
        warehouseQtys[whId] = (warehouseQtys[whId] || 0) + item.quantity;
      }

      for (const [whId, addedQty] of Object.entries(warehouseQtys)) {
        const warehouse = await Warehouse.findOne({ _id: whId, agencyId });
        if (!warehouse) {
          throw new ApiError('Warehouse not found', 404);
        }
        if (warehouse.usedCapacity + addedQty > warehouse.capacity) {
          const availableCapacity = warehouse.capacity - warehouse.usedCapacity;
          throw new ApiError(
            `Warehouse "${warehouse.warehouseName || 'Unknown'}" has insufficient capacity. Available space: ${availableCapacity}, Attempting to add: ${addedQty}`,
            400,
          );
        }
      }
    }
  }

  const order = await repository.createOrder(data);
  if (order && order.items && order.items.length > 0) {
    for (const item of order.items) {
      const adjustment = order.orderType === 'sell' ? -item.quantity : item.quantity;
      await Product.findOneAndUpdate(
        { _id: item.product, agencyId },
        { 
          $inc: { quantity: adjustment },
          $set: { lowStockReadBy: [] }
        },
        { new: true },
      );

      await Warehouse.findOneAndUpdate(
        { _id: item.warehouse, agencyId },
        { $inc: { usedCapacity: adjustment } },
        { new: true },
      );
    }
  }
  return order;
};

export const getOrders = async (
  agencyId: string | undefined,
  page: number,
  perPage: number,
  orderType?: string,
  search?: string,
) => {
  const [orders, total] = await Promise.all([
    repository.getOrders(agencyId, page, perPage, orderType, search),
    repository.countOrders(agencyId, orderType, search),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
};

export const getOrderById = async (id: string, agencyId: string | undefined) => {
  const order = await repository.getOrderById(id, agencyId);
  if (!order) {
    throw new ApiError('Order not found', 404);
  }
  return order;
};

export const updateOrder = async (id: string, data: Partial<IOrder>, agencyId: string | undefined) => {
  const order = await repository.updateOrder(id, data, agencyId);
  if (!order) {
    throw new ApiError('Order not found', 404);
  }
  return order;
};

export const deleteOrder = async (id: string, agencyId: string | undefined) => {
  const order = await repository.getOrderById(id, agencyId);
  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Reverse the quantity adjustment before deleting the order
  if (order.items && order.items.length > 0) {
    for (const item of order.items) {
      const adjustment = order.orderType === 'sell' ? item.quantity : -item.quantity;
      await Product.findOneAndUpdate(
        { _id: item.product, agencyId },
        { 
          $inc: { quantity: adjustment },
          $set: { lowStockReadBy: [] }
        },
        { new: true },
      );

      await Warehouse.findOneAndUpdate(
        { _id: item.warehouse, agencyId },
        { $inc: { usedCapacity: adjustment } },
        { new: true },
      );
    }
  }

  await repository.deleteOrder(id, agencyId);
  return order;
};

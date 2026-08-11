import { Contact } from '../contacts/contact.model';

import { type IOrder, Order } from './order.model';

export const createOrder = async (
  data: Partial<IOrder> & { companyId: string },
): Promise<IOrder> => {
  const order = new Order(data);
  return await order.save();
};

export const buildOrderFilter = async (
  companyId: string,
  orderType?: string,
  search?: string,
): Promise<Record<string, unknown>> => {
  const filter: Record<string, unknown> & { $or?: Record<string, unknown>[] } = { companyId };

  if (orderType) {
    filter.orderType = orderType;
  }

  if (search) {
    // Find contacts matching the search term scoped to the company
    const matchingContacts = await Contact.find({
      name: { $regex: search, $options: 'i' },
      companyId,
    })
      .select('_id')
      .lean();
    const contactIds = matchingContacts.map((c) => c._id);
    filter.$or = [
      { deliveryAddress: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } },
    ];
    if (contactIds.length) {
      filter.$or.push({ contact: { $in: contactIds } });
    }
  }

  return filter;
};

export const getOrders = async (
  companyId: string,
  page: number = 1,
  perPage: number = 10,
  orderType?: string,
  search?: string,
): Promise<IOrder[]> => {
  const filter = await buildOrderFilter(companyId, orderType, search);

  const skip = (page - 1) * perPage;
  return await Order.find(filter)
    .populate('contact')
    .populate('items.warehouse')
    .populate('items.product')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);
};

export const countOrders = async (
  companyId: string,
  orderType?: string,
  search?: string,
): Promise<number> => {
  const filter = await buildOrderFilter(companyId, orderType, search);
  return await Order.countDocuments(filter);
};

export const getOrderById = async (id: string, companyId: string): Promise<IOrder | null> => {
  return await Order.findOne({ _id: id, companyId })
    .populate('contact')
    .populate('items.warehouse')
    .populate('items.product');
};

export const updateOrder = async (
  id: string,
  data: Partial<IOrder>,
  companyId: string,
): Promise<IOrder | null> => {
  return await Order.findOneAndUpdate({ _id: id, companyId }, data, { new: true })
    .populate('contact')
    .populate('items.warehouse')
    .populate('items.product');
};

export const deleteOrder = async (id: string, companyId: string): Promise<IOrder | null> => {
  return await Order.findOneAndDelete({ _id: id, companyId });
};

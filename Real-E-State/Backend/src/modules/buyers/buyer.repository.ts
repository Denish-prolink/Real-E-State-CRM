import { Buyer } from './buyer.model';
import type { IBuyer } from './buyer.types';

export const createBuyer = async (data: Partial<IBuyer> & { companyId: string }) => {
  const buyer = new Buyer(data);
  return await buyer.save();
};

const buildFilter = (companyId: string, search?: string) => {
  const base: any = { companyId };
  if (!search) return base;
  return {
    companyId,
    $or: [{ notes: { $regex: search, $options: 'i' } }],
  };
};

export const getBuyers = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(companyId, search);
  if (page === undefined || perPage === undefined) {
    return Buyer.find(filter).populate('contactId').sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Buyer.find(filter).populate('contactId').sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countBuyers = async (companyId: string, search?: string) => {
  return Buyer.countDocuments(buildFilter(companyId, search));
};

export const getBuyerById = async (id: string, companyId: string) => {
  return Buyer.findOne({ _id: id, companyId }).populate('contactId');
};

export const updateBuyer = async (id: string, data: Partial<IBuyer>, companyId: string) => {
  return Buyer.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteBuyer = async (id: string, companyId: string) => {
  return Buyer.findOneAndDelete({ _id: id, companyId });
};

import { Buyer } from './buyer.model';
import type { IBuyer } from './buyer.types';

export const createBuyer = async (data: Partial<IBuyer> & { agencyId: string }) => {
  const buyer = new Buyer(data);
  return await buyer.save();
};

const buildFilter = (agencyId: string, search?: string) => {
  const base: any = { agencyId };
  if (!search) return base;
  return {
    agencyId,
    $or: [{ notes: { $regex: search, $options: 'i' } }],
  };
};

export const getBuyers = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(agencyId, search);
  if (page === undefined || perPage === undefined) {
    return Buyer.find(filter).populate('contactId').sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Buyer.find(filter).populate('contactId').sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countBuyers = async (agencyId: string, search?: string) => {
  return Buyer.countDocuments(buildFilter(agencyId, search));
};

export const getBuyerById = async (id: string, agencyId: string) => {
  return Buyer.findOne({ _id: id, agencyId }).populate('contactId');
};

export const updateBuyer = async (id: string, data: Partial<IBuyer>, agencyId: string) => {
  return Buyer.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteBuyer = async (id: string, agencyId: string) => {
  return Buyer.findOneAndDelete({ _id: id, agencyId });
};

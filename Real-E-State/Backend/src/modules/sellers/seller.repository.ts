import { Seller } from './seller.model';
import type { ISeller } from './seller.types';

export const createSeller = async (data: Partial<ISeller> & { agencyId: string }) => {
  const seller = new Seller(data);
  return await seller.save();
};

const buildFilter = (agencyId: string, search?: string) => {
  const base: any = { agencyId };
  if (!search) {
    return base;
  }
  return {
    agencyId,
    $or: [{ notes: { $regex: search, $options: 'i' } }],
  };
};

export const getSellers = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(agencyId, search);
  if (page === undefined || perPage === undefined) {
    return Seller.find(filter).populate('contactId').sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Seller.find(filter)
    .populate('contactId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);
};

export const countSellers = async (agencyId: string, search?: string) => {
  return Seller.countDocuments(buildFilter(agencyId, search));
};

export const getSellerById = async (id: string, agencyId: string) => {
  return Seller.findOne({ _id: id, agencyId }).populate('contactId');
};

export const updateSeller = async (id: string, data: Partial<ISeller>, agencyId: string) => {
  return Seller.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteSeller = async (id: string, agencyId: string) => {
  return Seller.findOneAndDelete({ _id: id, agencyId });
};

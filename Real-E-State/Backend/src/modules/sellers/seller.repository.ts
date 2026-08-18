import { Seller } from './seller.model';
import type { ISeller } from './seller.types';

export const createSeller = async (data: Partial<ISeller> & { companyId: string }) => {
  const seller = new Seller(data);
  return await seller.save();
};

const buildFilter = (companyId: string, search?: string) => {
  const base: any = { companyId };
  if (!search) return base;
  return {
    companyId,
    $or: [{ notes: { $regex: search, $options: 'i' } }],
  };
};

export const getSellers = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(companyId, search);
  if (page === undefined || perPage === undefined) {
    return Seller.find(filter).populate('contactId').sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Seller.find(filter).populate('contactId').sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countSellers = async (companyId: string, search?: string) => {
  return Seller.countDocuments(buildFilter(companyId, search));
};

export const getSellerById = async (id: string, companyId: string) => {
  return Seller.findOne({ _id: id, companyId }).populate('contactId');
};

export const updateSeller = async (id: string, data: Partial<ISeller>, companyId: string) => {
  return Seller.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteSeller = async (id: string, companyId: string) => {
  return Seller.findOneAndDelete({ _id: id, companyId });
};

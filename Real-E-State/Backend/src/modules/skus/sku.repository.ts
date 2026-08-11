import { Sku } from './sku.model';
import type { ISkuPayload } from './sku.types';

export const createSku = async (payload: ISkuPayload & { companyId: string }) => {
  const sku = new Sku(payload);
  return sku.save();
};

const buildFilter = (companyId: string, search?: string) => {
  return search
    ? {
        companyId,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { skuCode: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
};

export const findSkus = async (
  companyId: string,
  page?: number,
  limit?: number,
  search?: string,
) => {
  const query = buildFilter(companyId, search);
  if (page === undefined || limit === undefined) {
    return Sku.find(query).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * limit;
  return Sku.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
};

export const countSkus = async (companyId: string, search?: string) => {
  return Sku.countDocuments(buildFilter(companyId, search));
};

export const findSkuById = async (id: string, companyId: string) => {
  return Sku.findOne({ _id: id, companyId });
};

export const findSkuByCode = async (skuCode: string, companyId: string) => {
  return Sku.findOne({ skuCode, companyId });
};

export const updateSku = async (id: string, payload: Partial<ISkuPayload>, companyId: string) => {
  return Sku.findOneAndUpdate({ _id: id, companyId }, payload, { new: true });
};

export const deleteSku = async (id: string, companyId: string) => {
  return Sku.findOneAndDelete({ _id: id, companyId });
};

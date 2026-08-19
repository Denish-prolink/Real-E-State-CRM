import { Sku } from './sku.model';
import type { ISkuPayload } from './sku.types';

export const createSku = async (payload: ISkuPayload & { agencyId: string }) => {
  const sku = new Sku(payload);
  return sku.save();
};

const buildFilter = (agencyId: string, search?: string) => {
  return search
    ? {
        agencyId,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { skuCode: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
};

export const findSkus = async (
  agencyId: string,
  page?: number,
  limit?: number,
  search?: string,
) => {
  const query = buildFilter(agencyId, search);
  if (page === undefined || limit === undefined) {
    return Sku.find(query).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * limit;
  return Sku.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
};

export const countSkus = async (agencyId: string, search?: string) => {
  return Sku.countDocuments(buildFilter(agencyId, search));
};

export const findSkuById = async (id: string, agencyId: string) => {
  return Sku.findOne({ _id: id, agencyId });
};

export const findSkuByCode = async (skuCode: string, agencyId: string) => {
  return Sku.findOne({ skuCode, agencyId });
};

export const updateSku = async (id: string, payload: Partial<ISkuPayload>, agencyId: string) => {
  return Sku.findOneAndUpdate({ _id: id, agencyId }, payload, { new: true });
};

export const deleteSku = async (id: string, agencyId: string) => {
  return Sku.findOneAndDelete({ _id: id, agencyId });
};

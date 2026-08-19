import { Product } from './product.model';
import type { IProductPayload } from './product.types';

export const createProduct = async (payload: IProductPayload & { agencyId: string | undefined }) => {
  return Product.create(payload);
};

export const findProductByBarcode = async (barcode: string, agencyId: string | undefined) => {
  if (!barcode) {
    return null;
  }
  return Product.findOne({ barcode, agencyId });
};

const buildFilter = (agencyId: string | undefined, search?: string) => {
  return search
    ? {
        agencyId,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { supplier: { $regex: search, $options: 'i' } },
          { barcode: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
};

export const findProducts = async (
  agencyId: string | undefined,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(agencyId, search);
  if (page === undefined || perPage === undefined) {
    return Product.find(filter).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countProducts = async (agencyId: string | undefined, search?: string) => {
  return Product.countDocuments(buildFilter(agencyId, search));
};

export const findProductById = async (id: string, agencyId: string | undefined) => {
  return Product.findOne({ _id: id, agencyId });
};

export const updateProduct = async (
  id: string,
  payload: Partial<IProductPayload>,
  agencyId: string | undefined,
) => {
  const updateData: any = { ...payload };
  if (payload.quantity !== undefined) {
    updateData.lowStockReadBy = [];
  }
  return Product.findOneAndUpdate({ _id: id, agencyId }, updateData, { new: true });
};

export const deleteProduct = async (id: string, agencyId: string | undefined) => {
  return Product.findOneAndDelete({ _id: id, agencyId });
};

import { Product } from './product.model';
import type { IProductPayload } from './product.types';

export const createProduct = async (payload: IProductPayload & { companyId: string }) => {
  return Product.create(payload);
};

export const findProductByBarcode = async (barcode: string, companyId: string) => {
  if (!barcode) {
    return null;
  }
  return Product.findOne({ barcode, companyId });
};

const buildFilter = (companyId: string, search?: string) => {
  return search
    ? {
        companyId,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { supplier: { $regex: search, $options: 'i' } },
          { barcode: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
};

export const findProducts = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(companyId, search);
  if (page === undefined || perPage === undefined) {
    return Product.find(filter).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countProducts = async (companyId: string, search?: string) => {
  return Product.countDocuments(buildFilter(companyId, search));
};

export const findProductById = async (id: string, companyId: string) => {
  return Product.findOne({ _id: id, companyId });
};

export const updateProduct = async (
  id: string,
  payload: Partial<IProductPayload>,
  companyId: string,
) => {
  const updateData: any = { ...payload };
  if (payload.quantity !== undefined) {
    updateData.lowStockReadBy = [];
  }
  return Product.findOneAndUpdate({ _id: id, companyId }, updateData, { new: true });
};

export const deleteProduct = async (id: string, companyId: string) => {
  return Product.findOneAndDelete({ _id: id, companyId });
};

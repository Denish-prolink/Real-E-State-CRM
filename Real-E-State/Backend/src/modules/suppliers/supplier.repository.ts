import { Supplier } from './supplier.model';
import type { ISupplierPayload } from './supplier.types';

export const createSupplier = async (payload: ISupplierPayload & { companyId: string }) => {
  return Supplier.create(payload);
};

export const findSupplierByCode = async (code: string, companyId: string) => {
  return Supplier.findOne({ supplierCode: { $regex: new RegExp(`^${code}$`, 'i') }, companyId });
};

const buildFilter = (companyId: string, search?: string) => {
  return search
    ? {
        companyId,
        $or: [
          { supplierName: { $regex: search, $options: 'i' } },
          { supplierCode: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
};

export const findSuppliers = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(companyId, search);
  if (page === undefined || perPage === undefined) {
    return Supplier.find(filter).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Supplier.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countSuppliers = async (companyId: string, search?: string) => {
  return Supplier.countDocuments(buildFilter(companyId, search));
};

export const findSupplierById = async (id: string, companyId: string) => {
  return Supplier.findOne({ _id: id, companyId });
};

export const updateSupplier = async (
  id: string,
  payload: Partial<ISupplierPayload>,
  companyId: string,
) => {
  return Supplier.findOneAndUpdate({ _id: id, companyId }, payload, { new: true });
};

export const deleteSupplier = async (id: string, companyId: string) => {
  return Supplier.findOneAndDelete({ _id: id, companyId });
};

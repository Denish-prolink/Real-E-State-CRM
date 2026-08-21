import { Supplier } from './supplier.model';
import type { ISupplierPayload } from './supplier.types';

export const createSupplier = async (payload: ISupplierPayload & { agencyId: string }) => {
  return Supplier.create(payload);
};

export const findSupplierByCode = async (code: string, agencyId: string) => {
  return Supplier.findOne({ supplierCode: { $regex: new RegExp(`^${code}$`, 'i') }, agencyId });
};

const buildFilter = (agencyId: string, search?: string) => {
  return search
    ? {
        agencyId,
        $or: [
          { supplierName: { $regex: search, $options: 'i' } },
          { supplierCode: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
};

export const findSuppliers = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(agencyId, search);
  if (page === undefined || perPage === undefined) {
    return Supplier.find(filter).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return Supplier.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countSuppliers = async (agencyId: string, search?: string) => {
  return Supplier.countDocuments(buildFilter(agencyId, search));
};

export const findSupplierById = async (id: string, agencyId: string) => {
  return Supplier.findOne({ _id: id, agencyId });
};

export const updateSupplier = async (
  id: string,
  payload: Partial<ISupplierPayload>,
  agencyId: string,
) => {
  return Supplier.findOneAndUpdate({ _id: id, agencyId }, payload, { new: true });
};

export const deleteSupplier = async (id: string, agencyId: string) => {
  return Supplier.findOneAndDelete({ _id: id, agencyId });
};

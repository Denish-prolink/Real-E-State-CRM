import { Category } from './category.model';
import type { ICategoryPayload } from './category.types';

export const createCategory = async (payload: ICategoryPayload & { companyId: string }) => {
  return Category.create(payload);
};

export const findCategoryByName = async (name: string, companyId: string) => {
  return Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, companyId });
};

const buildFilter = (companyId: string, search?: string) => {
  return search
    ? {
        companyId,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
};

export const findCategories = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(companyId, search);
  if (page === undefined || perPage === undefined) {
    return Category.find(filter).sort({ name: 1 });
  }
  const skip = (page - 1) * perPage;
  return Category.find(filter).sort({ name: 1 }).skip(skip).limit(perPage);
};

export const countCategories = async (companyId: string, search?: string) => {
  return Category.countDocuments(buildFilter(companyId, search));
};

export const findCategoryById = async (id: string, companyId: string) => {
  return Category.findOne({ _id: id, companyId });
};

export const updateCategory = async (
  id: string,
  payload: Partial<ICategoryPayload>,
  companyId: string,
) => {
  return Category.findOneAndUpdate({ _id: id, companyId }, payload, { new: true });
};

export const deleteCategory = async (id: string, companyId: string) => {
  return Category.findOneAndDelete({ _id: id, companyId });
};

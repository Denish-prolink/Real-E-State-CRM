import { Category } from './category.model';
import type { ICategoryPayload } from './category.types';

export const createCategory = async (payload: ICategoryPayload & { agencyId: string | undefined }) => {
  return Category.create(payload);
};

export const findCategoryByName = async (name: string, agencyId: string | undefined) => {
  return Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, agencyId });
};

const buildFilter = (agencyId: string | undefined, search?: string) => {
  return search
    ? {
        agencyId,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
};

export const findCategories = async (
  agencyId: string | undefined,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const filter = buildFilter(agencyId, search);
  if (page === undefined || perPage === undefined) {
    return Category.find(filter).sort({ name: 1 });
  }
  const skip = (page - 1) * perPage;
  return Category.find(filter).sort({ name: 1 }).skip(skip).limit(perPage);
};

export const countCategories = async (agencyId: string | undefined, search?: string) => {
  return Category.countDocuments(buildFilter(agencyId, search));
};

export const findCategoryById = async (id: string, agencyId: string | undefined) => {
  return Category.findOne({ _id: id, agencyId });
};

export const updateCategory = async (
  id: string,
  payload: Partial<ICategoryPayload>,
  agencyId: string | undefined,
) => {
  return Category.findOneAndUpdate({ _id: id, agencyId }, payload, { new: true });
};

export const deleteCategory = async (id: string, agencyId: string | undefined) => {
  return Category.findOneAndDelete({ _id: id, agencyId });
};

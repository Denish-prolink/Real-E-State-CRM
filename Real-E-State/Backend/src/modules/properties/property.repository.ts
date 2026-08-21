import { Property } from './property.model';
import type { IProperty } from './property.types';

export const createProperty = async (data: Partial<IProperty>) => {
  return Property.create(data);
};

export const findPropertiesByAgency = async (agencyId: string, filters: any = {}) => {
  return Property.find({ agencyId, ...filters })
    .populate('projectId', 'name')
    .sort({ createdAt: -1 });
};

export const findPropertyById = async (id: string, agencyId: string) => {
  return Property.findOne({ _id: id, agencyId }).populate('projectId', 'name');
};

export const updatePropertyById = async (
  id: string,
  agencyId: string,
  data: Partial<IProperty>,
) => {
  return Property.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deletePropertyById = async (id: string, agencyId: string) => {
  return Property.findOneAndDelete({ _id: id, agencyId });
};

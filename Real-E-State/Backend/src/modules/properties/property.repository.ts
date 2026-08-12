import { Property } from './property.model';
import type { IProperty } from './property.types';

export const createProperty = async (data: Partial<IProperty>) => {
  return Property.create(data);
};

export const findPropertiesByCompany = async (companyId: string, filters: any = {}) => {
  return Property.find({ companyId, ...filters }).populate('projectId', 'name').sort({ createdAt: -1 });
};

export const findPropertyById = async (id: string, companyId: string) => {
  return Property.findOne({ _id: id, companyId }).populate('projectId', 'name');
};

export const updatePropertyById = async (id: string, companyId: string, data: Partial<IProperty>) => {
  return Property.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deletePropertyById = async (id: string, companyId: string) => {
  return Property.findOneAndDelete({ _id: id, companyId });
};

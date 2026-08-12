import * as propertyRepository from './property.repository';
import type { IProperty } from './property.types';

export const createPropertyService = async (companyId: string, data: Partial<IProperty>) => {
  return propertyRepository.createProperty({ ...data, companyId: companyId as any });
};

export const getPropertiesService = async (companyId: string, filters: any = {}) => {
  return propertyRepository.findPropertiesByCompany(companyId, filters);
};

export const getPropertyByIdService = async (id: string, companyId: string) => {
  const property = await propertyRepository.findPropertyById(id, companyId);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

export const updatePropertyService = async (id: string, companyId: string, data: Partial<IProperty>) => {
  const property = await propertyRepository.updatePropertyById(id, companyId, data);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

export const deletePropertyService = async (id: string, companyId: string) => {
  const property = await propertyRepository.deletePropertyById(id, companyId);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

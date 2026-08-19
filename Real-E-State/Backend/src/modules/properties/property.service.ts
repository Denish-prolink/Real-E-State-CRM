import * as propertyRepository from './property.repository';
import type { IProperty } from './property.types';

export const createPropertyService = async (agencyId: string | undefined, data: Partial<IProperty>) => {
  return propertyRepository.createProperty({ ...data, agencyId: agencyId as any });
};

export const getPropertiesService = async (agencyId: string | undefined, filters: any = {}) => {
  return propertyRepository.findPropertiesByCompany(agencyId, filters);
};

export const getPropertyByIdService = async (id: string, agencyId: string | undefined) => {
  const property = await propertyRepository.findPropertyById(id, agencyId);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

export const updatePropertyService = async (id: string, agencyId: string | undefined, data: Partial<IProperty>) => {
  const property = await propertyRepository.updatePropertyById(id, agencyId, data);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

export const deletePropertyService = async (id: string, agencyId: string | undefined) => {
  const property = await propertyRepository.deletePropertyById(id, agencyId);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};

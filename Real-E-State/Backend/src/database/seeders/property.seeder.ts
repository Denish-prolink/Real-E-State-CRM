import logger from '../../config/logger';
import { Property } from '../../modules/properties/property.model';
import type { ICompany } from '../../modules/companies/company.model';

export const seedProperties = async (companies: ICompany[]) => {
  logger.info('Seeding Properties...');
  await Property.deleteMany({});
  
  const properties = [];
  
  for (const company of companies) {
    properties.push({
      agencyId: company._id,
      propertyName: 'Sunset Villas',
      propertyType: 'Villa',
      category: 'Residential',
      price: 1500000,
      area: 2500,
      areaUnit: 'sqft',
      bedrooms: 4,
      bathrooms: 3,
      status: 'Available'
    });
    
    properties.push({
      agencyId: company._id,
      propertyName: 'Downtown Apartments',
      propertyType: 'Apartment',
      category: 'Residential',
      price: 850000,
      area: 1200,
      areaUnit: 'sqft',
      bedrooms: 2,
      bathrooms: 2,
      status: 'Available'
    });
    
    properties.push({
      agencyId: company._id,
      propertyName: 'Green Valley Plot',
      propertyType: 'Plot',
      category: 'Land',
      price: 300000,
      area: 5000,
      areaUnit: 'sqft',
      status: 'Available'
    });
  }

  await Property.insertMany(properties);
  return await Property.find();
};

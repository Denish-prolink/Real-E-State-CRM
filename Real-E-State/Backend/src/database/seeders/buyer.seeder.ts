import logger from '../../config/logger';
import { Buyer } from '../../modules/buyers/buyer.model';
import type { ICompany } from '../../modules/companies/company.model';

export const seedBuyers = async (companies: ICompany[]) => {
  logger.info('Seeding Buyers...');
  await Buyer.deleteMany({});
  
  const buyers = [];
  
  for (const company of companies) {
    buyers.push({
      agencyId: company._id,
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '1122334455',
      address: '456 Side St, City',
      preferences: {
        propertyType: ['Apartment', 'Villa'],
        minBudget: 500000,
        maxBudget: 2000000,
        locations: ['Metropolis']
      }
    });
  }

  await Buyer.insertMany(buyers);
  return await Buyer.find();
};

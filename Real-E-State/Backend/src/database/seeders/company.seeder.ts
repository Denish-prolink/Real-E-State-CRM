import { Company } from '../../modules/companies/company.model';
import logger from '../../config/logger';

export const seedCompanies = async () => {
  logger.info('Seeding Companies...');
  await Company.deleteMany({});
  const company1 = await Company.create({
    name: 'Acme Corp',
    addressLine1: '123 Acme Street',
    city: 'Metropolis',
    state: 'NY',
    country: 'USA',
    pincode: '10001',
    contactNumber: '1234567890',
    email: 'admin@acme.com',
    status: 'active',
  });

  const company2 = await Company.create({
    name: 'Stark Industries',
    addressLine1: '456 Stark Tower',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    pincode: '10002',
    contactNumber: '0987654321',
    email: 'admin@stark.com',
    status: 'active',
  });

  return [company1, company2];
};

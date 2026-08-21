import logger from '../../config/logger';
import { Agency } from '../../modules/agencies/agency.model';

export const seedAgencies = async () => {
  logger.info('Seeding Agencies...');
  await Agency.deleteMany({});
  const agency1 = await Agency.create({
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

  const agency2 = await Agency.create({
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

  return [agency1, agency2];
};

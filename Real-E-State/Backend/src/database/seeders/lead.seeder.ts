import logger from '../../config/logger';
import { Lead } from '../../modules/leads/lead.model';
import type { ICompany } from '../../modules/companies/company.model';

export const seedLeads = async (companies: ICompany[]) => {
  logger.info('Seeding Leads...');
  await Lead.deleteMany({});
  
  const leads = [];
  
  for (const company of companies) {
    leads.push({
      agencyId: company._id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      source: 'Website',
      status: 'New',
      propertyType: 'Apartment',
      budget: 900000,
      assignedTo: null
    });
    
    leads.push({
      agencyId: company._id,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
      source: 'Referral',
      status: 'Contacted',
      propertyType: 'Villa',
      budget: 1600000,
      assignedTo: null
    });
  }

  await Lead.insertMany(leads);
  return await Lead.find();
};

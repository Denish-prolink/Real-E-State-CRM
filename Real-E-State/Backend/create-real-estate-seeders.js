const fs = require('fs');
const path = require('path');

const SEEDERS_DIR = path.join(__dirname, 'src/database/seeders');

const propertySeeder = `import logger from '../../config/logger';
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
`;

const projectSeeder = `import logger from '../../config/logger';
import { Project } from '../../modules/projects/project.model';
import type { ICompany } from '../../modules/companies/company.model';

export const seedProjects = async (companies: ICompany[]) => {
  logger.info('Seeding Projects...');
  await Project.deleteMany({});
  
  const projects = [];
  
  for (const company of companies) {
    projects.push({
      agencyId: company._id,
      name: 'Skyline Residences',
      type: 'Residential',
      status: 'Under Construction',
      location: {
        address: '123 Main St',
        city: 'Metropolis',
        state: 'State',
        zipCode: '12345',
        country: 'Country'
      },
      amenities: ['Pool', 'Gym', 'Parking']
    });
  }

  await Project.insertMany(projects);
  return await Project.find();
};
`;

const leadSeeder = `import logger from '../../config/logger';
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
`;

const buyerSeeder = `import logger from '../../config/logger';
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
`;

fs.writeFileSync(path.join(SEEDERS_DIR, 'property.seeder.ts'), propertySeeder);
fs.writeFileSync(path.join(SEEDERS_DIR, 'project.seeder.ts'), projectSeeder);
fs.writeFileSync(path.join(SEEDERS_DIR, 'lead.seeder.ts'), leadSeeder);
fs.writeFileSync(path.join(SEEDERS_DIR, 'buyer.seeder.ts'), buyerSeeder);

console.log('Real estate seeders created successfully.');

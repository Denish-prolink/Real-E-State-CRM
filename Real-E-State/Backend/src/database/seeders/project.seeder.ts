import logger from '../../config/logger';
import { Project } from '../../modules/projects/project.model';
import type { ICompany } from '../../modules/companies/company.model';

export const seedProjects = async (companies: ICompany[]) => {
  logger.info('Seeding Projects...');
  await Project.deleteMany({});
  
  const projects = [];
  
  for (const company of companies) {
    projects.push({
      agencyId: company._id,
      name: `Skyline Residences - ${company.name}`,
      projectType: 'Residential',
      status: 'Active',
      location: 'Downtown',
      address: '123 Main St',
      city: 'Metropolis',
      state: 'State',
      amenities: ['Pool', 'Gym', 'Parking']
    });
  }

  await Project.insertMany(projects);
  return await Project.find();
};

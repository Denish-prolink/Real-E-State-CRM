import { connectDatabase } from '../config/database';
import logger from '../config/logger';

import { seedPermissions } from './seeders/permissions.seeder';
import { seedRoles } from './seeders/roles.seeder';
import { seedUsers } from './seeders/user.seeder';

const seedDatabase = async () => {
  try {
    await connectDatabase();

    logger.info('Starting Database Seeding Process...');

    // 1. Core independent entities
    // Seed role/permission constants first
    await seedRoles();
    await seedPermissions();

    // 2. Seed Users
    await seedUsers();

    logger.info('Database seeded successfully with all mock data!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

import { connectDatabase } from '../config/database';
import logger from '../config/logger';

import { seedCategories } from './seeders/category.seeder';
import { seedAgencies } from './seeders/agency.seeder';
import { seedContacts } from './seeders/contact.seeder';
import { seedEmployees } from './seeders/employee.seeder';
import { seedOrders } from './seeders/order.seeder';
import { seedPermissions } from './seeders/permissions.seeder';
import { seedProducts } from './seeders/product.seeder';
import { seedRoles } from './seeders/roles.seeder';
import { seedSkus } from './seeders/sku.seeder';
import { seedSuppliers } from './seeders/supplier.seeder';
import { seedUsers } from './seeders/user.seeder';
import { seedWarehouses } from './seeders/warehouse.seeder';

const seedDatabase = async () => {
  try {
    await connectDatabase();

    logger.info('Starting Database Seeding Process...');

    // 1. Core independent entities
    // Seed role/permission constants first
    await seedRoles();
    await seedPermissions();

    const agencies = await seedAgencies();

    // 2. Entities dependent on Agencies
    await seedUsers(agencies);
    await seedCategories(agencies);
    const contacts = await seedContacts(agencies);
    const employees = await seedEmployees(agencies);
    await seedSkus(agencies);
    await seedSuppliers(agencies);
    const products = await seedProducts(agencies);

    // 3. Entities dependent on Agencies and Employees
    const warehouses = await seedWarehouses(agencies, employees);

    // 4. Entities dependent on multiple previous entities
    await seedOrders(agencies, contacts, products, warehouses);

    logger.info('Database seeded successfully with all mock data!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

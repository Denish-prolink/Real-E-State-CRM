import { connectDatabase } from '../config/database';
import logger from '../config/logger';

import { seedCategories } from './seeders/category.seeder';
import { seedCompanies } from './seeders/company.seeder';
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

    const companies = await seedCompanies();

    // 2. Entities dependent on Companies
    await seedUsers(companies);
    await seedCategories(companies);
    const contacts = await seedContacts(companies);
    const employees = await seedEmployees(companies);
    await seedSkus(companies);
    await seedSuppliers(companies);
    const products = await seedProducts(companies);

    // 3. Entities dependent on Companies and Employees
    const warehouses = await seedWarehouses(companies, employees);

    // 4. Entities dependent on multiple previous entities
    await seedOrders(companies, contacts, products, warehouses);

    logger.info('Database seeded successfully with all mock data!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

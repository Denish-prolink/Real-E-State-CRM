import logger from '../../config/logger';
import { Warehouse } from '../../modules/warehouses/warehouse.model';

export const seedWarehouses = async (companies: any[], employees: any[]) => {
  logger.info('Seeding Warehouses...');
  await Warehouse.deleteMany({});
  const company1 = companies[0];
  const company2 = companies[1];

  // Find employee managers for warehouses
  const manager1 = employees.find((e) => e.companyId.toString() === company1._id.toString());
  const manager2 = employees.find((e) => e.companyId.toString() === company2._id.toString());

  const warehouses = await Warehouse.create([
    {
      warehouseCode: 'WH001',
      warehouseName: 'Central Logistics Hub',
      warehouseType: 'Distribution Center',
      manager: manager1._id,
      addressLine1: '100 Logistics Way',
      city: 'Metropolis',
      state: 'NY',
      country: 'USA',
      pincode: '10001',
      capacity: 10000,
      usedCapacity: 500,
      companyId: company1._id,
    },
    {
      warehouseCode: 'WH002',
      warehouseName: 'Stark Secure Storage',
      warehouseType: 'Regular',
      manager: manager2._id,
      addressLine1: 'Level 42, Stark Tower',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      pincode: '10002',
      capacity: 5000,
      usedCapacity: 1000,
      companyId: company2._id,
    },
  ]);

  return warehouses;
};

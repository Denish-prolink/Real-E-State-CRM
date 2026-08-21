import logger from '../../config/logger';
import { Warehouse } from '../../modules/warehouses/warehouse.model';

export const seedWarehouses = async (agencies: any[], employees: any[]) => {
  logger.info('Seeding Warehouses...');
  await Warehouse.deleteMany({});
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  // Find employee managers for warehouses
  const manager1 = employees.find((e) => e.agencyId.toString() === agency1._id.toString());
  const manager2 = employees.find((e) => e.agencyId.toString() === agency2._id.toString());

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
      agencyId: agency1._id,
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
      agencyId: agency2._id,
    },
  ]);

  return warehouses;
};

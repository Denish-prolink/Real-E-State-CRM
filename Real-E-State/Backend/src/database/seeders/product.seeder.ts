import logger from '../../config/logger';
import { Product } from '../../modules/products/product.model';

export const seedProducts = async (agencies: any[]) => {
  logger.info('Seeding Products...');
  await Product.deleteMany({});
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  const products = await Product.create([
    {
      title: 'Laptop Pro',
      description: 'High performance laptop for professionals',
      quantity: 50,
      rawPrice: 1000,
      salePrice: 1500,
      category: 'Electronics',
      supplier: ['Global Tech Suppliers'],
      agencyId: agency1._id,
      status: 'Active',
    },
    {
      title: 'Ergonomic Desk Chair',
      description: 'Comfortable office chair with lumbar support',
      quantity: 100,
      rawPrice: 100,
      salePrice: 200,
      category: 'Furniture',
      supplier: ['Furniture Co'],
      agencyId: agency1._id,
      status: 'Active',
    },
    {
      title: 'Arc Reactor Mk I',
      description: 'Clean energy generation unit',
      quantity: 5,
      rawPrice: 500000,
      salePrice: 999999,
      category: 'Weapons',
      supplier: ['Stark Labs'],
      agencyId: agency2._id,
      status: 'Active',
    },
  ]);

  return products;
};

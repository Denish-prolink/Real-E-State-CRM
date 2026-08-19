import { Product } from '../../modules/products/product.model';
import logger from '../../config/logger';

export const seedProducts = async (companies: any[]) => {
  logger.info('Seeding Products...');
  await Product.deleteMany({});
  const company1 = companies[0];
  const company2 = companies[1];

  const products = await Product.create([
    {
      title: 'Laptop Pro',
      description: 'High performance laptop for professionals',
      quantity: 50,
      rawPrice: 1000,
      salePrice: 1500,
      category: 'Electronics',
      supplier: ['Global Tech Suppliers'],
      agencyId: company1._id,
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
      agencyId: company1._id,
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
      agencyId: company2._id,
      status: 'Active',
    },
  ]);

  return products;
};

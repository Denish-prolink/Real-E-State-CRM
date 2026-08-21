import logger from '../../config/logger';
import { Category } from '../../modules/categories/category.model';

export const seedCategories = async (companies: any[]) => {
  logger.info('Seeding Categories...');
  await Category.deleteMany({});
  const company1 = companies[0];
  const company2 = companies[1];

  const categories = await Category.create([
    { name: 'Electronics', description: 'Electronic devices', companyId: company1._id },
    { name: 'Furniture', description: 'Office furniture', companyId: company1._id },
    { name: 'Weapons', description: 'Advanced tech', companyId: company2._id },
  ]);

  return categories;
};

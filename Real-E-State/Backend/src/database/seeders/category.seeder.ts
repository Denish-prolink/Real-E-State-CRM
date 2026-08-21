import logger from '../../config/logger';
import { Category } from '../../modules/categories/category.model';

export const seedCategories = async (agencies: any[]) => {
  logger.info('Seeding Categories...');
  await Category.deleteMany({});
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  const categories = await Category.create([
    { name: 'Electronics', description: 'Electronic devices', agencyId: agency1._id },
    { name: 'Furniture', description: 'Office furniture', agencyId: agency1._id },
    { name: 'Weapons', description: 'Advanced tech', agencyId: agency2._id },
  ]);

  return categories;
};

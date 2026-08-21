import logger from '../../config/logger';
import { Sku } from '../../modules/skus/sku.model';

export const seedSkus = async (companies: any[]) => {
  logger.info('Seeding SKUs...');
  await Sku.deleteMany({});
  const company1 = companies[0];
  const company2 = companies[1];

  const skus = await Sku.create([
    {
      name: 'Box',
      unit: 'BOX',
      skuCode: 'BX01',
      description: 'Standard box packaging',
      companyId: company1._id,
    },
    {
      name: 'Pieces',
      unit: 'PIECES',
      skuCode: 'PC01',
      description: 'Individual piece',
      companyId: company1._id,
    },
    {
      name: 'Kilograms',
      unit: 'KILOGRAMS',
      skuCode: 'KG01',
      description: 'Weight in kg',
      companyId: company2._id,
    },
  ]);

  return skus;
};

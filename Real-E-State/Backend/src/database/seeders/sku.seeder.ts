import { Sku } from '../../modules/skus/sku.model';
import logger from '../../config/logger';

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
      agencyId: company1._id,
    },
    {
      name: 'Pieces',
      unit: 'PIECES',
      skuCode: 'PC01',
      description: 'Individual piece',
      agencyId: company1._id,
    },
    {
      name: 'Kilograms',
      unit: 'KILOGRAMS',
      skuCode: 'KG01',
      description: 'Weight in kg',
      agencyId: company2._id,
    },
  ]);

  return skus;
};

import logger from '../../config/logger';
import { Sku } from '../../modules/skus/sku.model';

export const seedSkus = async (agencies: any[]) => {
  logger.info('Seeding SKUs...');
  await Sku.deleteMany({});
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  const skus = await Sku.create([
    {
      name: 'Box',
      unit: 'BOX',
      skuCode: 'BX01',
      description: 'Standard box packaging',
      agencyId: agency1._id,
    },
    {
      name: 'Pieces',
      unit: 'PIECES',
      skuCode: 'PC01',
      description: 'Individual piece',
      agencyId: agency1._id,
    },
    {
      name: 'Kilograms',
      unit: 'KILOGRAMS',
      skuCode: 'KG01',
      description: 'Weight in kg',
      agencyId: agency2._id,
    },
  ]);

  return skus;
};

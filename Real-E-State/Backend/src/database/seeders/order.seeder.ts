import logger from '../../config/logger';
import { Order } from '../../modules/orders/order.model';

export const seedOrders = async (
  companies: any[],
  contacts: any[],
  products: any[],
  warehouses: any[],
) => {
  logger.info('Seeding Orders...');
  await Order.deleteMany({});

  const company1 = companies[0];
  const company2 = companies[1];

  // Find corresponding records
  const customer1 = contacts.find(
    (c) => c.agencyId.toString() === company1._id.toString() && c.type === 'customer',
  );
  const supplier1 = contacts.find(
    (c) => c.agencyId.toString() === company1._id.toString() && c.type === 'supplier',
  );
  const product1 = products.find((p) => p.agencyId.toString() === company1._id.toString());
  const warehouse1 = warehouses.find((w) => w.agencyId.toString() === company1._id.toString());

  const customer2 = contacts.find((c) => c.agencyId.toString() === company2._id.toString());
  const product2 = products.find((p) => p.agencyId.toString() === company2._id.toString());
  const warehouse2 = warehouses.find((w) => w.agencyId.toString() === company2._id.toString());

  const orders = await Order.create([
    {
      orderType: 'purchase',
      contact: supplier1._id,
      items: [
        {
          warehouse: warehouse1._id,
          product: product1._id,
          sku: 'BX01',
          quantity: 20,
          price: product1.rawPrice,
          total: 20 * product1.rawPrice,
        },
      ],
      gstAndCharges: 50,
      discountType: 'amount',
      discountValue: 0,
      finalPrice: 20 * product1.rawPrice + 50,
      deliveryAddress: '123 Company Warehouse Address',
      status: 'completed',
      agencyId: company1._id,
    },
    {
      orderType: 'sell',
      contact: customer1._id,
      items: [
        {
          warehouse: warehouse1._id,
          product: product1._id,
          sku: 'BX01',
          quantity: 2,
          price: product1.salePrice,
          total: 2 * product1.salePrice,
        },
      ],
      gstAndCharges: 100,
      discountType: 'percentage',
      discountValue: 10,
      finalPrice: 2 * product1.salePrice * 0.9 + 100,
      deliveryAddress: customer1.address || 'Customer Addr',
      status: 'pending',
      agencyId: company1._id,
    },
    {
      orderType: 'sell',
      contact: customer2._id,
      items: [
        {
          warehouse: warehouse2._id,
          product: product2._id,
          sku: 'PC01',
          quantity: 1,
          price: product2.salePrice,
          total: product2.salePrice,
        },
      ],
      gstAndCharges: 0,
      discountType: 'amount',
      discountValue: 0,
      finalPrice: product2.salePrice,
      deliveryAddress: customer2.address || 'Stark Tower',
      status: 'confirmed',
      agencyId: company2._id,
    },
  ]);

  return orders;
};

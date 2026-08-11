import * as Yup from 'yup';

const orderItemSchema = Yup.object().shape({
  warehouse: Yup.string().required('Warehouse is required'),
  product: Yup.string().required('Product is required'),
  sku: Yup.string().required('SKU is required'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Min quantity is 1'),
  price: Yup.number().required('Price is required').min(0, 'Price cannot be negative'),
  total: Yup.number().min(0),
});

export const orderSchema = Yup.object().shape({
  contact: Yup.string().required('Contact is required'),
  items: Yup.array()
    .of(orderItemSchema)
    .min(1, 'At least one product item is required')
    .test(
      'unique-items',
      'Duplicate entries with the same Warehouse, Product, and SKU are not allowed. Please modify or combine them.',
      (items) => {
        if (!items) return true;
        const seen = new Set<string>();
        for (const item of items) {
          if (item.warehouse && item.product && item.sku) {
            const key = `${item.warehouse}-${item.product}-${item.sku}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
          }
        }
        return true;
      }
    ),
  gstAndCharges: Yup.number().min(0, 'Cannot be negative').default(0),
  discountType: Yup.string().oneOf(['percentage', 'amount']).default('amount'),
  discountValue: Yup.number().min(0, 'Cannot be negative').default(0),
  finalPrice: Yup.number().min(0),
  deliveryAddress: Yup.string(),
});

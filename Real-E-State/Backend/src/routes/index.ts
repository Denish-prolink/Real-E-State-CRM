import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes';
import categoryRoutes from '../modules/categories/category.routes';
import companyRoutes from '../modules/companies/company.routes';
import contactRoutes from '../modules/contacts/contact.routes';
import employeeRoutes from '../modules/employees/employee.routes';
import notificationRoutes from '../modules/notification/notification.routes';
import leadRoutes from '../modules/leads/lead.routes';
import propertyRoutes from '../modules/properties/property.routes';
import dealRoutes from '../modules/deals/deal.routes';
import siteVisitRoutes from '../modules/site-visits/site-visit.routes';
import orderRoutes from '../modules/orders/order.routes';
import productRoutes from '../modules/products/product.routes';
import reportRoutes from '../modules/reports/report.routes';
import skuRoutes from '../modules/skus/sku.routes';
import supplierRoutes from '../modules/suppliers/supplier.routes';
import warehouseRoutes from '../modules/warehouses/warehouse.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/companies', companyRoutes);
router.use('/contacts', contactRoutes);
router.use('/employees', employeeRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/skus', skuRoutes);
router.use('/orders', orderRoutes);
router.use('/reports', reportRoutes);
router.use('/leads', leadRoutes);
router.use('/properties', propertyRoutes);
router.use('/deals', dealRoutes);
router.use('/site-visits', siteVisitRoutes);
router.use('/notifications', notificationRoutes);

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real-E-State CRM Backend Running',
  });
});

export default router;

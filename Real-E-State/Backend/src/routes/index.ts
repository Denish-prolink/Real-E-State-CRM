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
import buyerRoutes from '../modules/buyers/buyer.routes';
import sellerRoutes from '../modules/sellers/seller.routes';
import roleRoutes from '../modules/roles/role.routes';
import permissionRoutes from '../modules/permissions/permission.routes';
import projectRoutes from '../modules/projects/project.routes';
import towerRoutes from '../modules/towers/tower.routes';
import unitRoutes from '../modules/units/unit.routes';
import agentRoutes from '../modules/agents/agent.routes';

import followUpsRoutes from '../modules/follow-ups/follow-ups.routes';
import callsRoutes from '../modules/calls/calls.routes';
import whatsappRoutes from '../modules/whatsapp/whatsapp.routes';
import emailRoutes from '../modules/email/email.routes';
import bookingsRoutes from '../modules/bookings/bookings.routes';
import paymentsRoutes from '../modules/payments/payments.routes';
import installmentsRoutes from '../modules/installments/installments.routes';
import documentsRoutes from '../modules/documents/documents.routes';
import auditLogsRoutes from '../modules/audit-logs/audit-logs.routes';
import settingsRoutes from '../modules/settings/settings.routes';

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
router.use('/buyers', buyerRoutes);
router.use('/sellers', sellerRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/projects', projectRoutes);
router.use('/towers', towerRoutes);
router.use('/units', unitRoutes);
router.use('/agents', agentRoutes);
router.use('/notifications', notificationRoutes);

// New Modules
router.use('/follow-ups', followUpsRoutes);
router.use('/calls', callsRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/email', emailRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/installments', installmentsRoutes);
router.use('/documents', documentsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use('/settings', settingsRoutes);

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real-E-State CRM Backend Running',
  });
});

export default router;

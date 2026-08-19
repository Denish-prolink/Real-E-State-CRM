import logger from '../../config/logger';
import { Supplier } from '../../modules/suppliers/supplier.model';

export const seedSuppliers = async (companies: any[]) => {
  logger.info('Seeding Suppliers...');
  await Supplier.deleteMany({});
  const company1 = companies[0];
  const company2 = companies[1];

  const suppliers = await Supplier.create([
    {
      supplierCode: 'SUP001',
      supplierName: 'Global Tech Suppliers',
      contactPerson: 'Tech Guy',
      mobile: '1231231234',
      email: 'tech@globalsuppliers.com',
      gstNumber: 'GSTIN1234567',
      panNumber: 'PAN12345',
      address: {
        addressLine1: '1 Tech Park',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        pincode: '94105',
      },
      supplierType: 'Electronics',
      paymentTerms: 'Net 30',
      creditLimit: 50000,
      openingBalance: 0,
      bankDetails: {
        bankName: 'Tech Bank',
        accountNumber: 'ACC123456',
        ifscCode: 'IFSC0001',
      },
      agencyId: company1._id,
    },
    {
      supplierCode: 'SUP002',
      supplierName: 'Wakanda Vibranium Corp',
      contactPerson: 'Shuri',
      mobile: '9999999999',
      email: 'supply@wakanda.gov',
      gstNumber: 'GSTWAKANDA1',
      panNumber: 'PANWAKANDA1',
      address: {
        addressLine1: 'Royal Palace',
        city: 'Birnin Zana',
        state: 'Wakanda',
        country: 'Wakanda',
        pincode: '00000',
      },
      supplierType: 'Raw Materials',
      paymentTerms: 'Immediate',
      creditLimit: 1000000,
      openingBalance: 0,
      bankDetails: {
        bankName: 'Wakanda Central Bank',
        accountNumber: 'VIB123456',
        ifscCode: 'WAK0001',
      },
      agencyId: company2._id,
    },
  ]);

  return suppliers;
};

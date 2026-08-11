export interface ISupplierPayload {
  supplierCode: string;
  supplierName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  gstNumber: string;
  panNumber: string;

  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  supplierType: string;
  paymentTerms: string;
  creditLimit: number;
  openingBalance: number;

  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };

  notes?: string;
  status: 'active' | 'inactive';
}

import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supplierCode: { type: String, required: true, trim: true },
    supplierName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    gstNumber: { type: String, required: true, trim: true },
    panNumber: { type: String, required: true, trim: true },

    address: {
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },

    supplierType: { type: String, required: true, trim: true },
    paymentTerms: { type: String, required: true, trim: true },
    creditLimit: { type: Number, required: true, default: 0 },
    openingBalance: { type: Number, required: true, default: 0 },

    bankDetails: {
      bankName: { type: String, required: true, trim: true },
      accountNumber: { type: String, required: true, trim: true },
      ifscCode: { type: String, required: true, trim: true },
    },

    notes: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

supplierSchema.index({ supplierCode: 1, agencyId: 1 }, { unique: true });

export const Supplier = mongoose.model('Supplier', supplierSchema);
